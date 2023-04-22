import { writable, get } from 'svelte/store'

export const currentPath = writable('')
export const currentPathArray = writable([])
export const prePageStack = writable([])
export const nextPageStack = writable([])
export const pinned = writable([])
export const extensionList = writable([])
export const tagList = writable([])
export const searchOption = writable({
    ext: [],
    tag: [],
    rate: [true, false, false, false, false],
})
export const currentFileRate = writable([])
export const currentSelectedFile = writable(null)
export const setCurrentSelectedFile = (file) => {
    if (get(currentSelectedFile)) {
        let currentElement = document.getElementById(`file-${get(currentSelectedFile).id}`)
        if (currentElement.classList.contains('file-focus')) currentElement.classList.remove('file-focus')
        else if (currentElement.classList.contains('image-focus')) {
            currentElement.classList.remove('image-focus')
            document.getElementById(`file-media-${get(currentSelectedFile).id}`).classList.remove('image-child-focus')
        } else if (currentElement.classList.contains('video-focus')) currentElement.classList.remove('video-focus')
    }
    currentSelectedFile.set(file)
    switch (file.type.split('/')[0]) {
        case 'image':
            document.getElementById(`file-${file.id}`).classList.add('image-focus')
            document.getElementById(`file-media-${file.id}`).classList.add('image-child-focus')
            break
        case 'video':
            document.getElementById(`file-${file.id}`).classList.add('video-focus')
            break
        default:
            document.getElementById(`file-${file.id}`).classList.add('file-focus')
            break
    }
}
export const clearCurrentSelectedFile = () => {
    if (get(currentSelectedFile)) {
        let currentElement = document.getElementById(`file-${get(currentSelectedFile).id}`)
        if (currentElement.classList.contains('file-focus')) currentElement.classList.remove('file-focus')
        else if (currentElement.classList.contains('image-focus')) {
            currentElement.classList.remove('image-focus')
            document.getElementById(`file-media-${get(currentSelectedFile).id}`).classList.remove('image-child-focus')
        } else if (currentElement.classList.contains('video-focus')) currentElement.classList.remove('video-focus')
    }
    currentSelectedFile.set(null)
}
export const zoom = writable(1)
export const defaultPath = writable(null)
export const currentFileList = writable([])
export const currentImageList = writable([])
export const currentVideoList = writable([])
export const currentFolderList = writable([])
export const metadata = writable({})
export const settingModal = writable(false)
export const contextMenu = writable(false)
export const editMode = writable(false)
export const loadingCursor = writable(false)
const keyArrowEvent = (event) => {
    event.preventDefault()
    document.activeElement.blur()
    // right 39, left 37, up 38, down 40, enter 13, backspace 8
    if (event.keyCode == 40) {
        if (!get(currentSelectedFile)) {
            if (get(currentFolderList)) setCurrentSelectedFile(get(currentFolderList)[0])
            else if (get(currentFileList)) setCurrentSelectedFile(get(currentFileList)[0])
            else if (get(currentVideoList)) setCurrentSelectedFile(get(currentVideoList)[0])
            else if (get(currentImageList)) setCurrentSelectedFile(get(currentImageList)[0])
        } else {
            let type = get(currentSelectedFile).type.split('/')[0]
            let id = get(currentSelectedFile).id
            if (type == 'folder') {
                let idx = get(currentFolderList).findIndex((f) => f.id == id)
                if (idx == get(currentFolderList).length - 1) {
                    if (get(currentFileList)) setCurrentSelectedFile(get(currentFileList)[0])
                    else if (get(currentVideoList)) setCurrentSelectedFile(get(currentVideoList)[0])
                    else if (get(currentImageList)) setCurrentSelectedFile(get(currentImageList)[0])
                    else if (get(currentFolderList)) setCurrentSelectedFile(get(currentFolderList)[0])
                } else {
                    setCurrentSelectedFile(get(currentFolderList)[idx + 1])
                }
            } else if (type == 'image') {
                let idx = get(currentImageList).findIndex((f) => f.id == id) + get(currentVideoList).length
                let findIdx
                for (let i = idx + 1; i <= idx + getGridColumn(); i++) {
                    console.log(document.getElementById('file-grid').children[i])
                    if (document.getElementById('file-grid').children[i].style.gridColumn == 'span 2 / auto') i--
                    findIdx = i
                }
                console.log(document.getElementById('file-grid').children[findIdx])
            } else if (type == 'video') console.log('video')
            else {
                let idx = get(currentFileList).findIndex((f) => f.id == id)
                if (idx == get(currentFileList).length - 1) {
                    if (get(currentVideoList)) setCurrentSelectedFile(get(currentVideoList)[0])
                    else if (get(currentImageList)) setCurrentSelectedFile(get(currentImageList)[0])
                    else if (get(currentFolderList)) setCurrentSelectedFile(get(currentFolderList)[0])
                    else if (get(currentFileList)) setCurrentSelectedFile(get(currentFileList)[0])
                } else {
                    setCurrentSelectedFile(get(currentFileList)[idx + 1])
                }
            }
        }
    }
}
export const startKeyBoardEvent = () => {
    //document.addEventListener('keydown', keyArrowEvent)
}
export const stopKeyBoardEvent = () => {
    //document.removeEventListener('keydown', keyArrowEvent)
}

const calcType = (type) => {
    type = type.split('/')[0]
    if (type == 'folder') return 'folder'
    else if (['image', 'video'].includes(type)) return 'media'
    else return 'file'
}

const getGridColumn = () => {
    const gridComputedStyle = window.getComputedStyle(document.getElementById('file-grid'))
    return gridComputedStyle.getPropertyValue('grid-template-columns').split(' ').length
}
