const { app, BrowserWindow, ipcMain, screen, dialog, shell, clipboard } = require('electron')
const path = require('path')
const serve = require('electron-serve')
const loadURL = serve({ directory: 'public' })
const fs = require('fs')
const thumbLocation = app.getPath('userData') + '\\thumbs'
const mime = require('mime-types')
const { user } = require('./src/main/store')
const { browser } = require('./src/main/browser')
const {
    startDatabase,
    getUserData,
    getPinnedData,
    setUserData,
    setPinnedData,
    getMetaData,
    setMetadataRate,
    setMetadataTag,
} = require('./src/main/db.js')
const { formatBytes } = require('./src/main/util')
const { exec } = require('child_process')
require('./src/main/protocol')

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd'),
    //forceHardReset: true,
})

let mainWindow,
    metadata = {}

function isDev() {
    return !app.isPackaged
}

app.disableHardwareAcceleration()

function createWindow() {
    let displays = screen.getAllDisplays()
    let externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, 'public/favicon.png'),
        show: false,
        titleBarStyle: 'hidden',
        roundedCorners: false,
    })

    if (externalDisplay) {
        mainWindow.setBounds({
            x: externalDisplay.bounds.x + 461,
            y: externalDisplay.bounds.y + 300,
            width: 500,
            height: 300,
        })
    }

    if (isDev()) {
        mainWindow.loadURL('http://localhost:8080/')
    } else {
        loadURL(mainWindow)
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        mainWindow.maximize()
        mainWindow.openDevTools()
    })
}

app.on('ready', () => {
    createWindow()

    ipcMain.on('minimize-window', () => {
        mainWindow.minimize()
    })

    ipcMain.on('maximize-window', () => {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    })

    ipcMain.on('close-window', async (event, arg) => {
        await setUserData('ZOOM', arg.zoom)
        mainWindow.close()
    })

    ipcMain.on('app:start', async (event) => {
        !fs.existsSync(thumbLocation) && fs.mkdirSync(thumbLocation)
        await startDatabase()
        await getUserData().then((data) => {
            user.set('defaultPath', data.defaultPath)
            browser.newPage(data.defaultPath)
            event.sender.send('app:get-defaultPath', data.defaultPath)
            event.sender.send('app:get-zoom', data.zoom)
        })
        event.sender.send('app:get-pinned', await getPinnedData())
        event.sender.send('app:get-path', browser.getBrowserStack())
        event.sender.send('app:set-tool-button')
        await getFiles(browser.getBrowserStack()[0].path).then((data) => event.sender.send('app:get-files', data))
    })

    ipcMain.on('app:set-defaultPath', async (event) => {
        let newDefaultPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0]
        setUserData('defaultPath', newDefaultPath)
        user.set('defaultPath', newDefaultPath)
        event.sender.send('app:get-defaultPath', newDefaultPath)
    })

    ipcMain.on('app:drag-file', async (event, arg) => {
        event.sender.startDrag({
            file: arg,
            icon: `${__dirname}\\src\\renderer\\icons\\ui\\dragIcon.png`,
        })
    })

    ipcMain.on('app:open-file', (event, arg) => {
        fs.existsSync(arg) && shell.openPath(arg)
    })

    ipcMain.on('app:reveal-in-explorer', (event, arg) => {
        shell.showItemInFolder(arg)
    })

    ipcMain.on('app:copy-path', (event, arg) => {
        clipboard.writeText(arg)
    })

    ipcMain.on('app:copy-file', async (event, arg) => {
        if (arg != null) {
            let cPath = browser.getCurrentPath().path
            let idx = 1
            let extIndex = arg.name.lastIndexOf('.')
            let newFilePath = `${cPath}\\${arg.name}`
            let ext = arg.name.slice(extIndex + 1)
            if (extIndex != -1) newFilePath = `${cPath}\\${arg.name.slice(0, extIndex)}.${ext}`
            while (true) {
                if (fs.existsSync(newFilePath) == false) {
                    fs.copyFileSync(arg.path, newFilePath)
                    break
                }
                newFilePath = `${cPath}\\${arg.name.slice(0, extIndex)} (${idx++}).${ext}`
            }
            await getFiles(cPath).then((data) => event.sender.send('app:get-files', data))
        }
    })

    ipcMain.on('app:copy-folder', (event, arg) => {
        console.log(arg)
        //exec(`xcopy "${arg.path}" "${browser.getCurrentPath().path}\\${arg.name}"`, (error, stdout, stderr) => {
        //    console.log(`error: ${error}`)
        //    console.log()
        //    console.log()
        //    console.log()
        //    console.log()
        //    console.log()
        //    console.log(`stdout: ${stdout}`)
        //    console.log()
        //    console.log()
        //    console.log()
        //    console.log()
        //    console.log(`stderr: ${stderr}`)
        //})
    })

    ipcMain.on('app:delete-file', async (event, arg) => {
        await shell.trashItem(arg)
        await getFiles(browser.getCurrentPath().path).then((data) => {
            event.sender.send('app:clear-current-selected-file')
            event.sender.send('app:get-files', data)
        })
    })

    ipcMain.on('app:refresh', async (event, arg) => {
        await getFiles(browser.getCurrentPath().path).then((data) => {
            event.sender.send('app:clear-current-selected-file')
            event.sender.send('app:get-files', data)
        })
    })

    ipcMain.on('app:make-folder', async (event) => {
        let cPath = browser.getCurrentPath().path
        let idx = 1
        let newFolderPath = `${cPath}\\New Folder`
        while (true) {
            if (fs.existsSync(newFolderPath) == false) {
                fs.mkdirSync(newFolderPath)
                break
            }
            newFolderPath = `${cPath}\\New Folder (${idx++})`
        }
        await getFiles(cPath).then((data) => event.sender.send('app:get-files', data))
    })

    ipcMain.on('app:set-pinned', async (event) => {
        await setPinnedData(browser.getCurrentPath())
        event.sender.send('app:get-pinned', await getPinnedData())
    })

    ipcMain.on('app:set-metadata', (event, arg) => {
        Promise.all(
            arg.option.map(async (opt) => {
                let [type, value] = opt
                if (type == 'rate') return await setMetadataRate(arg.id, value)
                else if (type == 'tag') return await setMetadataTag(arg.id, value)
            })
        ).then(
            async () =>
                await getFiles(browser.getCurrentPath().path).then((data) => event.sender.send('app:get-files', data))
        )
    })

    ipcMain.on('app:get-all-child-files', async (event) => {
        const getAllChildFiles = () => {
            return new Promise(async (resolve, reject) => {
                let [fileData, fileRates, fileTags, fileExtList] = await getFiles(user.defaultPath)
                let stack = fileData.filter((file) => file.type == 'folder/folder')
                while (stack.length) {
                    let [fData, fRates, fTags, fExtList] = await getFiles(stack.shift().path)
                    let directory = fData.filter((file) => file.type == 'folder/folder')
                    directory.forEach((d) => stack.push(d))
                    fileData = [...fileData, ...fData]
                    fRates.forEach((r, i) => (fileRates[i] += r))
                    fileTags = [...fileTags, ...fTags]
                    fileExtList = [...fileExtList, ...fExtList]
                }
                resolve([fileData, fileRates, [...new Set(fileTags)], [...new Set(fileExtList)]])
            })
        }
        await getAllChildFiles().then((data) => {
            event.sender.send('app:get-all-child-files', {
                data: data[0].filter((f) => f.type != 'folder/folder'),
                rate: data[1],
                tag: data[2],
                ext: data[3],
            })
        })
    })

    ipcMain.on('app:new-page', async (event, arg) => {
        browser.newPage(arg)
        event.sender.send('app:clear-current-selected-file')
        event.sender.send('app:get-path', browser.getBrowserStack())
        event.sender.send('app:set-tool-button')
        await getFiles(arg).then((data) => event.sender.send('app:get-files', data))
    })

    ipcMain.on('app:pre-page', async (event) => {
        browser.prePage()
        event.sender.send('app:clear-current-selected-file')
        event.sender.send('app:get-path', browser.getBrowserStack())
        event.sender.send('app:set-tool-button')
        await getFiles(browser.getCurrentPath().path).then((data) => event.sender.send('app:get-files', data))
    })

    ipcMain.on('app:next-page', async (event) => {
        browser.nextPage()
        event.sender.send('app:clear-current-selected-file')
        event.sender.send('app:get-path', browser.getBrowserStack())
        event.sender.send('app:set-tool-button')
        await getFiles(browser.getCurrentPath().path).then((data) => event.sender.send('app:get-files', data))
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

const getFiles = async (filePath) => {
    let fileList = []
    let rateArray = [0, 0, 0, 0, 0]
    let tags = []
    let extensionList = []
    metadata = await getMetaData()
    const readFiles = () => {
        return new Promise((resolve) => {
            let fileType
            fs.readdirSync(filePath, {
                withFileTypes: true,
            }).forEach(async (file) => {
                if (file.isFile() || file.isDirectory()) {
                    if (file.isDirectory()) fileType = 'folder/folder'
                    else if (file.isFile()) {
                        fileType = mime.lookup(file.name)
                        if (fileType == false) fileType = 'etc/etc'
                        let [extType, extDetail] = fileType.split('/')
                        let compareExt
                        if (extType == 'image') compareExt = 'image'
                        else if (extType == 'video') compareExt = 'video'
                        else if (extType == 'audio') compareExt = 'audio'
                        else if (extType == 'text') compareExt = 'text'
                        else compareExt = extDetail
                        if (!extensionList.includes(compareExt)) extensionList.push(compareExt)
                    }
                    let stat = fs.statSync(filePath + '\\' + file.name)
                    let rate = metadata[`${stat.ino}${parseInt(stat.birthtimeMs)}`]
                        ? metadata[`${stat.ino}${parseInt(stat.birthtimeMs)}`].rate
                        : 0
                    let tag = metadata[`${stat.ino}${parseInt(stat.birthtimeMs)}`]
                        ? metadata[`${stat.ino}${parseInt(stat.birthtimeMs)}`].tag
                        : []
                    tag.forEach((t) => {
                        if (!tags.includes(t)) tags.push(t)
                    })
                    if (rate != 0) rateArray[rate - 1] += 1
                    fileList.push({
                        id: `${stat.ino}${parseInt(stat.birthtimeMs)}`,
                        inode: stat.ino,
                        size: formatBytes(stat.size),
                        name: file.name,
                        type: fileType,
                        path: filePath + '\\' + file.name,
                        rate: rate,
                        tag: tag,
                    })
                }
            })
            resolve(fileList)
        })
    }
    return [await readFiles(), rateArray, tags, extensionList]
}
