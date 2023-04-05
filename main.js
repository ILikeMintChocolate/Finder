const { app, BrowserWindow, ipcMain, screen, protocol, shell } = require('electron')
const path = require('path')
const serve = require('electron-serve')
const loadURL = serve({ directory: 'public' })
const fs = require('fs')
const storage = require('electron-json-storage')
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

ffmpeg.setFfprobePath(ffprobePath.path)
ffmpeg.setFfmpegPath(ffmpegPath.path)
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd'),
})

let mainWindow,
    currentPath,
    defaultPath,
    zoom,
    pinned,
    metadata = {}
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

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        mainWindow.openDevTools()
    })
}

app.on('ready', () => {
    createWindow()

    ipcMain.on('minimize-window', (event) => {
        mainWindow.minimize()
    })

    ipcMain.on('maximize-window', () => {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    })

    ipcMain.on('close-window', () => {
        storage.set('userData', { defaultPath: defaultPath, zoom: zoom }, function (error) {
            if (error) throw error
            mainWindow.close()
        })
    })

    ipcMain.on('app:start', async (event, arg) => {
        let data = storage.getSync('userData')
        zoom = data.zoom
        event.sender.send('app:set-zoom', zoom)
        event.sender.send('app:get-path', currentPath)
        event.sender.send('app:set-search', pinned)
        event.sender.send('app:set-metadata', metadata)
        try {
            event.sender.send('app:get-files', [await getFiles(currentPath.path), extensionList])
        } catch (e) {
            console.error(e)
        }
        event.sender.send('app:set-tool-button', currentPath)
        event.sender.send('app:set-path-history', currentPath)
    })

    ipcMain.on('app:set-path', async (event, arg) => {
        fs.access(arg, fs.constants.F_OK, (err) => {
            if (err) {
                event.sender.send('app:no-path')
            } else {
                ;(async function () {
                    currentPath = {
                        path: arg,
                        inode: fs.statSync(arg).ino,
                    }
                    event.sender.send('app:get-path', currentPath)
                    try {
                        event.sender.send('app:get-files', [await getFiles(arg), extensionList])
                    } catch (e) {
                        console.error(e)
                    }
                    event.sender.send('app:set-tool-button', arg)
                    event.sender.send('app:init-current-Selected')
                })()
            }
        })
    })

    ipcMain.on('app:set-path-history', async (event, arg) => {
        event.sender.send('app:set-path-history', arg)
    })

    ipcMain.on('app:set-zoom', async (event, arg) => {
        zoom = arg
    })

    ipcMain.on('app:open-file', (event, arg) => {
        if (fs.existsSync(arg)) {
            open(arg)
        }
    })

    ipcMain.on('app:get-file-info', async (event, arg) => {
        event.sender.send('app:get-file-info', {
            path: arg.file.path,
            name: arg.file.name,
            type: arg.file.type,
            index: arg.index,
            inode: await getINode(arg.file.path),
        })
        /*
        if (arg[2] == 'folder') {
            
        } else {
            event.sender.send('app:get-file-info', [arg[2], arg[1], fs.statSync(arg[0]).size])
        }
        */
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
        event.sender.startDrag({
            file: arg,
        })
    })

    ipcMain.on('app:save-metadata', (event, arg) => {
        metadata = arg
        storage.set('metadata', arg, function (error) {
            if (error) throw error
        })
    })

    ipcMain.on('app:set-pinned', (event, arg) => {
        if (arg == true) {
            if (currentPath.path[currentPath.path.length - 1] == '\\')
                currentPath.path = currentPath.path.slice(0, currentPath.path.length - 1)
            let pinSplit = currentPath.path.split('\\')
            let pinObj = {
                title: pinSplit[pinSplit.length - 1],
                path: currentPath.path,
                inode: currentPath.inode,
            }
            pinned.push(pinObj)
        } else {
            let idx
            for (let i = 0; i < pinned.length; i++) {
                if (pinned[i].inode == currentPath.inode) idx = i
            }
            pinned = [...pinned.slice(0, idx), ...pinned.slice(idx + 1, pinned.length)]
        }
        event.sender.send('app:set-search', pinned)
        storage.set('search', { pinned: pinned }, function (error) {
            if (error) throw error
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

    const initData = () => {
        if (fs.existsSync(thumbLocation) == false) {
            fs.mkdirSync(thumbLocation)
        }
        storage.get('userData', (error, data) => {
            if (error) throw error
            if (Object.keys(data).length === 0) {
                storage.set('userData', { defaultPath: 'C:\\', zoom: 1 }, function (error) {
                    if (error) throw error
                })
                currentPath = {
                    path: 'C:\\',
                    inode: fs.statSync('C:\\').ino,
                }
                defaultPath = 'C:\\'
            } else {
                currentPath = {
                    path: data.defaultPath,
                    inode: fs.statSync(data.defaultPath).ino,
                }
                defaultPath = data.defaultPath
            }
        })
        storage.get('search', (error, data) => {
            if (error) throw error
            if (Object.keys(data).length === 0) {
                storage.set('search', { pinned: [] }, function (error) {
                    if (error) throw error
                })
                pinned = []
            } else {
                pinned = data.pinned
            }
        })
        storage.get('tags', (error, data) => {
            if (error) throw error
            if (Object.keys(data).length === 0) {
                storage.set('tags', {}, function (error) {
                    if (error) throw error
                })
                tags = {}
            } else {
                tags = data
            }
        })
        storage.get('metadata', (error, data) => {
            if (error) throw error
            if (Object.keys(data).length === 0) {
                storage.set('metadata', {}, function (error) {
                    if (error) throw error
                })
                metadata = {}
            } else {
                metadata = data
            }
        })
    }
    initData()
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
    extensionList = []
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
                            let dimensions = sizeOf(fs.readFileSync(decodeURI(currentPath.path + '\\' + file.name)))
                            resolution = {
                                width: dimensions.width,
                                height: dimensions.height,
                            }
                        } else if (extType == 'video') {
                            compareExt = 'video'
                        } else if (extType == 'text') compareExt = 'text'
                        else compareExt = extDetail
                        if (!extensionList.includes(compareExt)) extensionList.push(compareExt)
                    }
                    let stat = fs.statSync(filePath + '\\' + file.name)
                    fileList.push({
                        inode: stat.ino,
                        size: formatBytes(stat.size),
                        name: file.name,
                        type: fileType,
                        path: filePath + '\\' + file.name,
                        hash: `${stat.ino}${parseInt(stat.birthtimeMs)}`,
                        resolution: resolution,
                        rate: metadata[`${stat.ino}${parseInt(stat.birthtimeMs)}`]
                            ? metadata[`${stat.ino}${parseInt(stat.birthtimeMs)}`].rate
                            : -1,
                    })
                }
            })
            resolve(fileList)
        })
    }
    try {
        return await readFiles()
    } catch (e) {
        console.error(e)
    }
}
