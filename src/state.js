import { writable, get } from 'svelte/store'

export const currentPath = writable('')
export const currentPathIndex = writable(1)
export const currentPathArray = writable([])
export const pathHistory = writable([])
export const currentSelectedFile = writable(null)
export const zoom = writable(1)
export const currentFileList = writable([])
export const currentFolderList = writable([])
export const initCurrentSelected = () => {
    document.activeElement.blur()
    currentSelectedFile.set(null)
}
const keyArrowEvent = (event) => {
    event.preventDefault()
    if (event.keyCode == 8) {
        if (get(currentPath).length > 3) {
            window.electron.setPath(get(currentPath).slice(0, get(currentPath).lastIndexOf('\\')))
            window.electron.setPathHistory(get(currentPath).slice(0, get(currentPath).lastIndexOf('\\')))
            currentPathIndex.set(+1)
        }
    }
    if (get(currentSelectedFile) != null) {
        if (event.keyCode == 37) {
            if (get(currentSelectedFile).index > 0) {
                let newObj = get(currentFileList)[get(currentSelectedFile).index - 1]
                document.getElementById(`file-${newObj.path}`).focus()
                window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, get(currentSelectedFile).index - 1])
            }
        } else if (event.keyCode == 40) {
            let columnCount = getGridColumn()
            if (get(currentFileList).length > get(currentSelectedFile).index + columnCount) {
                let newObj = get(currentFileList)[get(currentSelectedFile).index + columnCount]
                document.getElementById(`file-${newObj.path}`).focus()
                window.electron.getFileInfo([
                    newObj.path,
                    newObj.name,
                    newObj.type,
                    get(currentSelectedFile).index + columnCount,
                ])
            }
        } else if (event.keyCode == 39) {
            if (get(currentSelectedFile).index + 1 < get(currentFileList).length) {
                let newObj = get(currentFileList)[get(currentSelectedFile).index + 1]
                document.getElementById(`file-${newObj.path}`).focus()
                window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, get(currentSelectedFile).index + 1])
            }
        } else if (event.keyCode == 38) {
            let columnCount = getGridColumn()
            if (get(currentSelectedFile).index - columnCount >= 0) {
                let newObj = get(currentFileList)[get(currentSelectedFile).index - columnCount]
                document.getElementById(`file-${newObj.path}`).focus()
                window.electron.getFileInfo([
                    newObj.path,
                    newObj.name,
                    newObj.type,
                    get(currentSelectedFile).index - columnCount,
                ])
            }
        } else if (event.keyCode == 13) {
            if (get(currentSelectedFile).type == 'folder') {
                window.electron.setPath(get(currentSelectedFile).path)
                window.electron.setPathHistory(get(currentSelectedFile).path)
                currentPathIndex.set(+1)
                pathHistory.set(get(pathHistory).slice(0, get(currentPathIndex)))
            } else {
                if (get(currentPath).length == 3) window.electron.openFile(get(currentSelectedFile).path)
                else window.electron.openFile(get(currentSelectedFile).path)
            }
        }
    } else {
        if (event.keyCode == 37) {
            let newObj = get(currentFileList)[get(currentFileList).length - 1]
            document.getElementById(`file-${newObj.path}`).focus()
            window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, get(currentFileList).length - 1])
        } else if (event.keyCode == 39) {
            let newObj = get(currentFileList)[0]
            document.getElementById(`file-${newObj.path}`).focus()
            window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, 0])
        }
    }
}
export const startKeyBoardEvent = () => {
    document.addEventListener('keydown', keyArrowEvent)
}
export const stopKeyBoardEvent = () => {
    document.removeEventListener('keydown', keyArrowEvent)
}
const getGridColumn = () => {
    const gridComputedStyle = window.getComputedStyle(document.getElementById('folder-grid'))
    return gridComputedStyle.getPropertyValue('grid-template-columns').split(' ').length
}
