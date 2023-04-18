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
    setDefaultPath: (arg) => {
        ipcRenderer.send('app:set-defaultPath', arg)
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
    setPinned: (arg) => {
        ipcRenderer.send('app:set-pinned', arg)
    },
    saveMetadata: (arg) => {
        ipcRenderer.send('app:save-metadata', arg)
    },
    setDefaultData: () => {
        ipcRenderer.send('app:set-defaultData')
    },
    getFiles: () => {
        ipcRenderer.send('app:get-files')
    },
    getAllChildFiles: () => {
        ipcRenderer.send('app:get-all-child-files')
    },

    receive: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args))
    },
})
