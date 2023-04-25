const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    minimizeWindow: () => {
        ipcRenderer.send('minimize-window')
    },
    maximizeWindow: () => {
        ipcRenderer.send('maximize-window')
    },
    closeWindow: (arg) => {
        ipcRenderer.send('close-window', arg)
    },
    start: () => {
        ipcRenderer.send('app:start')
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
    findAudioThumb: (arg) => {
        ipcRenderer.send('app:find-audio-thumb', arg)
    },
    findVideoThumb: (arg) => {
        ipcRenderer.send('app:find-video-thumb', arg)
    },
    setPinned: () => {
        ipcRenderer.send('app:set-pinned')
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
    setMetadata: (arg) => {
        ipcRenderer.send('app:set-metadata', arg)
    },
    dragFile: (arg) => {
        ipcRenderer.send('app:drag-file', arg)
    },
    newPage: (arg) => {
        ipcRenderer.send('app:new-page', arg)
    },
    prePage: () => {
        ipcRenderer.send('app:pre-page')
    },
    nextPage: () => {
        ipcRenderer.send('app:next-page')
    },
    makeFolder: () => {
        ipcRenderer.send('app:make-folder')
    },
    revealInExplorer: (arg) => {
        ipcRenderer.send('app:reveal-in-explorer', arg)
    },
    deleteFile: (arg) => {
        ipcRenderer.send('app:delete-file', arg)
    },
    copyPath: (arg) => {
        ipcRenderer.send('app:copy-path', arg)
    },
    copyFile: (arg) => {
        ipcRenderer.send('app:copy-file', arg)
    },

    receive: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args))
    },
})
