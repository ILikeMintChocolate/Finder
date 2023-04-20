const { app, BrowserWindow, ipcMain, screen, protocol, dialog } = require('electron')
const path = require('path')
const serve = require('electron-serve')
const loadURL = serve({ directory: 'public' })
const fs = require('fs')
const thumbLocation = app.getPath('userData') + '\\thumbs'
const sharp = require('sharp')
const jsmediatags = require('jsmediatags')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg')
const ffprobePath = require('@ffprobe-installer/ffprobe')
const open = require('open')
const mime = require('mime-types')
const url = require('url')
const sizeOf = require('image-size')
const { user } = require('./src/main/store')
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

ffmpeg.setFfprobePath(ffprobePath.path)
ffmpeg.setFfmpegPath(ffmpegPath.path)
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd'),
    //    //    forceHardReset: true,
})

let mainWindow,
    currentPath,
    metadata = {},
    extensionList = []

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

    ipcMain.on('app:start', async (event, arg) => {
        !fs.existsSync(thumbLocation) && fs.mkdirSync(thumbLocation)
        await startDatabase()
        await getUserData().then((data) => {
            user.set('defaultPath', data.defaultPath)
            let stat = fs.statSync(data.defaultPath)
            currentPath = {
                id: `${stat.ino}${parseInt(stat.birthtimeMs)}`,
                path: data.defaultPath,
            }
            event.sender.send('app:get-defaultPath', data.defaultPath)
            event.sender.send('app:get-zoom', data.zoom)
        })
        event.sender.send('app:get-pinned', await getPinnedData())

        event.sender.send('app:get-path', [currentPath, calcPath()])
        try {
            let [fileData, fileRates, fileTags] = await getFiles(currentPath.path)
            event.sender.send('app:get-files', {
                data: fileData,
                rate: fileRates,
                tag: fileTags,
                ext: extensionList,
            })
        } catch (e) {
            console.error(e)
        }
        event.sender.send('app:set-tool-button', currentPath.path)
        event.sender.send('app:set-path-history', currentPath)
    })

    ipcMain.on('app:set-path', async (event, arg) => {
        fs.access(arg, fs.constants.F_OK, (err) => {
            if (err) {
            } else {
                ;(async function () {
                    let stat = fs.statSync(arg)
                    currentPath = {
                        path: arg,
                        id: `${stat.ino}${parseInt(stat.birthtimeMs)}`,
                    }
                    event.sender.send('app:get-path', [currentPath, calcPath()])
                    try {
                        let [fileData, fileRates, fileTags] = await getFiles(arg)
                        event.sender.send('app:get-files', {
                            data: fileData,
                            rate: fileRates,
                            tag: fileTags,
                            ext: extensionList,
                        })
                    } catch (e) {
                        console.error(e)
                    }
                    event.sender.send('app:set-tool-button', arg)
                    event.sender.send('app:init-current-Selected')
                })()
            }
        })
    })

    ipcMain.on('app:set-defaultPath', async (event) => {
        let newDefaultPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0]
        setUserData('defaultPath', newDefaultPath)
        user.set('defaultPath', newDefaultPath)
        event.sender.send('app:get-defaultPath', newDefaultPath)
    })

    ipcMain.on('app:set-path-history', async (event, arg) => {
        event.sender.send('app:set-path-history', arg)
    })

    ipcMain.on('app:open-file', (event, arg) => {
        if (fs.existsSync(arg)) {
            open(arg)
        }
    })

    ipcMain.on('app:find-audio-thumb', (event, arg) => {
        let [inode, path] = arg
        let thumbUrl = thumbLocation + '\\' + inode + '.jpg'
        path = decodeURI(path)
        if (fs.existsSync(thumbUrl)) {
            event.sender.send('app:find-audio-thumb', [inode, true, thumbUrl])
        } else {
            jsmediatags.read(path, {
                onSuccess: function (tag) {
                    if (tag.tags?.picture?.data) {
                        sharp(Buffer.from(tag.tags.picture.data, 'base64'))
                            .resize(100, 100)
                            .toFile(thumbUrl, () => {
                                event.sender.send('app:find-audio-thumb', [inode, true, thumbUrl])
                            })
                    } else {
                        event.sender.send('app:find-audio-thumb', [inode, false])
                    }
                },
            })
        }
    })

    ipcMain.on('app:find-video-thumb', (event, arg) => {
        let [inode, path] = arg
        let thumbUrl = thumbLocation + '\\' + inode + '_1.jpg'
        if (fs.existsSync(thumbUrl)) {
            event.sender.send('app:find-video-thumb')
        } else {
            event.sender.send('app:generating-video-thumb', true)
            let count = 6
            let timestamps = []
            let startPositionPercent = 5
            let endPositionPercent = 95
            let addPercent = (endPositionPercent - startPositionPercent) / (count - 1)
            let idx = 0
            for (let i = 0; i < count; i++) {
                timestamps.push(`${startPositionPercent + addPercent * i}%`)
            }
            function takeScreenshots(i) {
                if (i == count) {
                    event.sender.send('app:find-video-thumb')
                    event.sender.send('app:generating-video-thumb', false)
                    return 0
                }
                const proc = new ffmpeg({ source: path, nolog: true })
                    .takeScreenshots(
                        {
                            count: 1,
                            timemarks: [timestamps[i]],
                            size: '500x?',
                            filename: `${inode}_${i + 1}.jpg`,
                        },
                        thumbLocation
                    )
                    .on('end', function () {
                        takeScreenshots(i + 1)
                    })
            }
            takeScreenshots(idx)
        }
    })

    ipcMain.on('app:drag-file', (event, arg) => {
        event.sender.startDrag({ file: arg })
    })

    ipcMain.on('app:set-pinned', async (event) => {
        await setPinnedData(currentPath)
        event.sender.send('app:get-pinned', await getPinnedData())
    })

    ipcMain.on('app:set-metadata', (event, arg) => {
        Promise.all(
            arg.option.map(async (opt) => {
                let [type, value] = opt
                if (type == 'rate') return await setMetadataRate(arg.id, value)
                else if (type == 'tag') return await setMetadataTag(arg.id, value)
            })
        ).then(async () => {
            await getFiles(currentPath.path).then((data) => {
                event.sender.send('app:get-files', {
                    data: data[0],
                    rate: data[1],
                    tag: data[2],
                    ext: extensionList,
                })
            })
        })
    })

    ipcMain.on('app:get-all-child-files', async (event) => {
        function getAllChildFiles() {
            return new Promise(async (resolve, reject) => {
                let [fileData, fileRates, fileTags] = await getFiles(user.defaultPath)
                let stack = fileData.filter((file) => file.type == 'folder/folder')
                while (stack.length) {
                    let [fData, fRates, fTags] = await getFiles(stack.shift().path)
                    let directory = fData.filter((file) => file.type == 'folder/folder')
                    directory.forEach((d) => stack.push(d))
                    fileData = [...fileData, ...fData]
                    fRates.forEach((r, i) => (fileRates[i] += r))
                    fileTags = [...fileTags, ...fTags]
                }
                resolve([fileData, fileRates, [...new Set(fileTags)]])
            })
        }
        let [fileData, fileRates, fileTags] = await getAllChildFiles()
        event.sender.send('app:get-all-child-files', {
            data: fileData.filter((f) => f.type != 'folder/folder'),
            rate: fileRates,
            tag: fileTags,
            ext: extensionList,
        })
    })

    protocol.registerFileProtocol('imagethumb', async (request, callback) => {
        let [inode, path, type] = request.url.replace('imagethumb://', '').split(',')
        let thumbUrl = thumbLocation + '\\' + inode + '.jpg'
        path = decodeURI(path)
        if (type.split('/')[1] == 'gif') {
            callback({ path: path })
        } else {
            if (fs.existsSync(thumbUrl)) {
                callback({ path: thumbUrl })
            } else {
                sharp(path)
                    .resize(500)
                    .toFile(thumbUrl, () => {
                        callback({ path: thumbUrl })
                    })
            }
        }
    })

    protocol.registerFileProtocol('image', async (request, callback) => {
        let path = request.url.replace('image://', '')
        path = decodeURI(path)
        if (fs.existsSync(path)) {
            callback({ path: path })
        }
    })

    protocol.registerFileProtocol('audio', async (request, callback) => {
        let inode = request.url.replace('audio://', '')
        let thumbUrl = thumbLocation + '\\' + inode + '.jpg'
        callback({ path: thumbUrl })
    })

    protocol.registerFileProtocol('videothumb', async (request, callback) => {
        let inode = request.url.replace('videothumb://', '')
        let thumbUrl = thumbLocation + '\\' + inode + '.jpg'
        callback({ path: thumbUrl })
    })

    protocol.registerFileProtocol('video', async (request, callback) => {
        let path = request.url.replace('video://', '')
        callback({ path: url.fileURLToPath('file://' + decodeURI(path)) })
    })

    const calcPath = () => {
        let splitArg = currentPath.path.split('\\')
        if (splitArg[splitArg.length - 1] == '') splitArg.pop()
        return splitArg.filter((p) => p != '')
    }
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const getFiles = async (filePath) => {
    let fileList = []
    let rateArray = [0, 0, 0, 0, 0]
    let tags = []
    extensionList = []
    metadata = await getMetaData()
    function readFiles() {
        return new Promise((resolve, reject) => {
            let fileType
            fs.readdirSync(filePath, {
                withFileTypes: true,
            }).forEach(async (file) => {
                if (file.isFile() || file.isDirectory()) {
                    let resolution = undefined
                    if (file.isDirectory()) fileType = 'folder/folder'
                    else if (file.isFile()) {
                        fileType = mime.lookup(file.name)
                        if (fileType == false) fileType = 'etc/etc'
                        let [extType, extDetail] = fileType.split('/')
                        let compareExt
                        if (extType == 'image') {
                            compareExt = 'image'
                            let dimensions = sizeOf(fs.readFileSync(decodeURI(filePath + '\\' + file.name)))
                            resolution = {
                                width: dimensions.width,
                                height: dimensions.height,
                            }
                        } else if (extType == 'video') {
                            compareExt = 'video'
                        } else if (extType == 'audio') {
                            compareExt = 'audio'
                        } else if (extType == 'text') compareExt = 'text'
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
                        resolution: resolution,
                        rate: rate,
                        tag: tag,
                    })
                }
            })
            resolve(fileList)
        })
    }
    try {
        return [await readFiles(), rateArray, tags]
    } catch (e) {
        console.error(e)
    }
}
