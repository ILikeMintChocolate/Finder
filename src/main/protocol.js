const { app, protocol, ipcMain } = require('electron')
const sharp = require('sharp')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg')
const ffprobePath = require('@ffprobe-installer/ffprobe')
const thumbLocation = app.getPath('userData') + '\\thumbs'
ffmpeg.setFfprobePath(ffprobePath.path)
ffmpeg.setFfmpegPath(ffmpegPath.path)

app.whenReady().then(() => {
    protocol.registerFileProtocol('image', async (request, callback) => {
        let path = decodeURI(request.url.replace('image://', ''))
        if (fs.existsSync(path)) callback({ path: path })
    })
    protocol.registerFileProtocol('video', async (request, callback) => {
        let path = decodeURI(request.url.replace('video://', ''))
        if (fs.existsSync(path)) callback({ path: path })
    })
    protocol.registerFileProtocol('imagethumb', async (request, callback) => {
        let [inode, path, type] = request.url.replace('imagethumb://', '').split(',')
        let thumbUrl = thumbLocation + '\\' + inode + '.jpg'
        path = decodeURI(path)
        if (type.split('/')[1] == 'gif') {
            callback({ path: path })
        } else {
            if (fs.existsSync(thumbUrl)) callback({ path: thumbUrl })
            else
                sharp(path)
                    .resize(500)
                    .toFile(thumbUrl, () => callback({ path: thumbUrl }))
        }
    })
    protocol.registerFileProtocol('videothumb', async (request, callback) => {
        let thumbUrl = `${thumbLocation}\\${request.url.replace('videothumb://', '')}.jpg`
        if (fs.existsSync(thumbUrl)) callback({ path: thumbUrl })
    })
    ipcMain.on('app:find-video-thumb', (event, arg) => {
        let [inode, path] = arg
        let thumbUrl = thumbLocation + '\\' + inode + '_1.jpg'
        if (fs.existsSync(thumbUrl)) event.sender.send('app:find-video-thumb')
        else {
            event.sender.send('app:generating-video-thumb', true)
            let idx = 0,
                count = 6,
                startPositionPercent = 5,
                endPositionPercent = 95,
                timestamps = [],
                addPercent = (endPositionPercent - startPositionPercent) / (count - 1)
            for (let i = 0; i < count; i++) timestamps.push(`${startPositionPercent + addPercent * i}%`)
            function takeScreenshots(i) {
                if (i == count) {
                    event.sender.send('app:find-video-thumb')
                    event.sender.send('app:generating-video-thumb', false)
                    return 0
                }
                new ffmpeg({ source: path, nolog: true })
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
})
