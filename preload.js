const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    minimizeWindow: (arg) => {
        ipcRenderer.send('minimize-window')
    },
    maximizeWindow: () => {
        ipcRenderer.send('maximize-window')
    },
    closeWindow: () => {
        ipcRenderer.send('close-window')
    },

    start: () => {
        ipcRenderer.send('app:start')
    },
    getFileInfo: (arg) => {
        ipcRenderer.send('app:get-file-info', arg)
    },
    setPath: (arg) => {
        ipcRenderer.send('app:set-path', arg)
    },
    setPathHistory: (arg) => {
        ipcRenderer.send('app:set-path-history', arg)
    },
    openFile: (arg) => {
        ipcRenderer.send('app:open-file', arg)
    },
    setZoom: (arg) => {
        ipcRenderer.send('app:set-zoom', arg)
    },
    dragFile: (arg) => {
        ipcRenderer.send('app:drag-file', arg)
    },

    findAudioThumb: (arg) => {
        ipcRenderer.send('app:find-audio-thumb', arg)
    },
    findVideoThumb: (arg) => {
        ipcRenderer.send('app:find-video-thumb', arg)
    },

    receive: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args))
    },
})
