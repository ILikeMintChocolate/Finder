import { writable, get } from 'svelte/store'

export const currentPath = writable('')
export const currentPathIndex = writable(1)
export const currentPathArray = writable([])
export const pinned = writable([])
export const extensionList = writable([])
export const searchOption = writable({
    ext: [],
    rate: -1,
})
export const pathHistory = writable([])
export const currentSelectedFile = writable(null)
export const zoom = writable(1)
export const currentFileList = writable([])
export const currentImageList = writable([])
export const currentVideoList = writable([])
export const currentFolderList = writable([])
export const metadata = writable({})
export const settingModal = writable(false)
export const editMode = writable(false)
export const loadingCursor = writable(false)
export const initCurrentSelected = () => {
    document.activeElement.blur()
    currentSelectedFile.set(null)
}
const keyArrowEvent = (event) => {
    event.preventDefault()
    if (event.keyCode == 8) {
        if (get(currentPath).path.length > 3) {
            window.electron.setPath(get(currentPath).path.slice(0, get(currentPath).path.lastIndexOf('\\')))
            window.electron.setPathHistory(get(currentPath).path.slice(0, get(currentPath).path.lastIndexOf('\\')))
            currentPathIndex.set(+1)
        }
    }

    //let columnCount = getGridColumn()
    if (get(currentSelectedFile) != null) {
        let type = calcType(get(currentSelectedFile).type)
        let id = 'file-' + get(currentSelectedFile).inode
        if (event.keyCode == 37) {
            // LEFT
            if (type == 'folder') {
                try {
                    document.getElementById(id).previousSibling.focus()
                } catch (error) {
                    try {
                        document
                            .getElementById('file-grid')
                            .children[document.getElementById('file-grid').childElementCount - 1].focus()
                    } catch (error) {
                        try {
                            document
                                .getElementById('file-list')
                                .children[document.getElementById('file-list').childElementCount - 1].focus()
                        } catch (error) {
                            document
                                .getElementById('folder-grid')
                                .children[document.getElementById('folder-grid').childElementCount - 1].focus()
                        }
                    }
                }
            } else if (type == 'file') {
                let parentNode = document.getElementById(id).parentNode
                let parentNodeChild = parentNode.children
                for (let i = 0; i < parentNodeChild.length; i++) {
                    if (parentNodeChild[i].id == id) {
                        if (i == 0) {
                            try {
                                document
                                    .getElementById('file-grid')
                                    .children[document.getElementById('file-grid').childElementCount - 1].focus()
                            } catch (error) {
                                try {
                                    document
                                        .getElementById('file-list')
                                        .children[document.getElementById('file-list').childElementCount - 1].focus()
                                } catch (error) {
                                    document
                                        .getElementById('folder-grid')
                                        .children[document.getElementById('folder-grid').childElementCount - 1].focus()
                                }
                            }
                        } else parentNodeChild[i - 1].focus()
                        break
                    }
                }
            } else if (type == 'media') {
                let parentNode = document.getElementById(id).parentNode
                let parentNodeChild = parentNode.children
                for (let i = 0; i < parentNodeChild.length; i++) {
                    if (parentNodeChild[i].id == id) {
                        if (i == 0) {
                            try {
                                document
                                    .getElementById('file-list')
                                    .children[document.getElementById('file-list').childElementCount - 1].focus()
                            } catch (error) {
                                try {
                                    document
                                        .getElementById('folder-list')
                                        .children[document.getElementById('folder-list').childElementCount - 1].focus()
                                } catch (error) {
                                    document
                                        .getElementById('file-grid')
                                        .children[document.getElementById('file-grid').childElementCount - 1].focus()
                                }
                            }
                        } else {
                            parentNodeChild[i - 1].focus()
                        }
                        break
                    }
                }
            }
        } else if (event.keyCode == 40) {
            // DOWN
            if (type == 'folder') {
                try {
                    document.getElementById(id).nextSibling.focus()
                } catch (error) {
                    try {
                        document.getElementById('file-list').childNodes[0].focus()
                    } catch (error) {
                        try {
                            document.getElementById('file-grid').childNodes[0].focus()
                        } catch (error) {
                            document.getElementById('folder-list').childNodes[0].focus()
                        }
                    }
                }
            } else if (type == 'file') {
                let parentNode = document.getElementById(id).parentNode
                let parentNodeChild = parentNode.children
                for (let i = 0; i < parentNodeChild.length; i++) {
                    if (parentNodeChild[i].id == id) {
                        if (i == parentNodeChild.length - 1) {
                            try {
                                document.getElementById('file-grid').children[0].focus()
                            } catch (error) {
                                try {
                                    document.getElementById('folder-list').children[0].focus()
                                } catch (error) {
                                    document.getElementById('file-list').children[0].focus()
                                }
                            }
                        } else {
                            parentNodeChild[i + 1].focus()
                        }
                        break
                    }
                }
            } else if (type == 'media') {
                const gridComputedStyle = window.getComputedStyle(document.getElementById(id))
                console.log(gridComputedStyle.getPropertyValue('row'))
                console.log(document.getElementById(id).getAttribute())
            }
        } else if (event.keyCode == 39) {
            // RIGHT
            if (type == 'folder') {
                try {
                    document.getElementById(id).nextSibling.focus()
                } catch (error) {
                    try {
                        document.getElementById('file-list').childNodes[0].focus()
                    } catch (error) {
                        try {
                            document.getElementById('file-grid').childNodes[0].focus()
                        } catch (error) {
                            document.getElementById('folder-list').childNodes[0].focus()
                        }
                    }
                }
            } else if (type == 'file') {
                let parentNode = document.getElementById(id).parentNode
                let parentNodeChild = parentNode.children
                for (let i = 0; i < parentNodeChild.length; i++) {
                    if (parentNodeChild[i].id == id) {
                        if (i == parentNodeChild.length - 1) {
                            try {
                                document.getElementById('file-grid').children[0].focus()
                            } catch (error) {
                                try {
                                    document.getElementById('folder-list').children[0].focus()
                                } catch (error) {
                                    document.getElementById('file-list').children[0].focus()
                                }
                            }
                        } else {
                            parentNodeChild[i + 1].focus()
                        }
                        break
                    }
                }
            } else if (type == 'media') {
                let parentNode = document.getElementById(id).parentNode
                let parentNodeChild = parentNode.children
                for (let i = 0; i < parentNodeChild.length; i++) {
                    if (parentNodeChild[i].id == id) {
                        if (i == parentNodeChild.length - 1) {
                            try {
                                document.getElementById('folder-list').children[0].focus()
                            } catch (error) {
                                try {
                                    document.getElementById('file-list').children[0].focus()
                                } catch (error) {
                                    document.getElementById('file-grid').children[0].focus()
                                }
                            }
                        } else {
                            parentNodeChild[i + 1].focus()
                        }
                        break
                    }
                }
            }
        } else if (event.keyCode == 38) {
            // UP
            if (type == 'folder') {
                try {
                    document.getElementById(id).previousSibling.focus()
                } catch (error) {
                    try {
                        document
                            .getElementById('file-grid')
                            .children[document.getElementById('file-grid').childElementCount - 1].focus()
                    } catch (error) {
                        try {
                            document
                                .getElementById('file-list')
                                .children[document.getElementById('file-list').childElementCount - 1].focus()
                        } catch (error) {
                            document
                                .getElementById('folder-grid')
                                .children[document.getElementById('folder-grid').childElementCount - 1].focus()
                        }
                    }
                }
            } else if (type == 'file') {
                let parentNode = document.getElementById(id).parentNode
                let parentNodeChild = parentNode.children
                for (let i = 0; i < parentNodeChild.length; i++) {
                    if (parentNodeChild[i].id == id) {
                        if (i == 0) {
                            try {
                                document
                                    .getElementById('folder-list')
                                    .children[document.getElementById('folder-list').childElementCount - 1].focus()
                            } catch (error) {
                                try {
                                    document
                                        .getElementById('folder-grid')
                                        .children[document.getElementById('folder-grid').childElementCount - 1].focus()
                                } catch (error) {
                                    document
                                        .getElementById('file-list')
                                        .children[document.getElementById('file-list').childElementCount - 1].focus()
                                }
                            }
                        } else parentNodeChild[i - 1].focus()
                        break
                    }
                }
            }
        } else if (event.keyCode == 13) {
            if (get(currentSelectedFile).type == 'folder') {
                window.electron.setPath(get(currentSelectedFile).path)
                window.electron.setPathHistory(get(currentSelectedFile).path)
                currentPathIndex.set(+1)
                pathHistory.set(get(pathHistory).slice(0, get(currentPathIndex)))
            } else {
                if (get(currentPath).path.length == 3) window.electron.openFile(get(currentSelectedFile).path)
                else window.electron.openFile(get(currentSelectedFile).path)
            }
        }
    } else {
        if ([39, 40].includes(event.keyCode)) {
            try {
                document.getElementById('folder-list').children[0].focus()
            } catch (error) {
                try {
                    document.getElementById('file-list').children[0].focus()
                } catch (error) {
                    document.getElementById('file-grid').children[0].focus()
                }
            }
        } else if ([38, 37].includes(event.keyCode)) {
            try {
                document
                    .getElementById('file-grid')
                    .children[document.getElementById('file-grid').childElementCount - 1].focus()
            } catch (error) {
                try {
                    document
                        .getElementById('file-list')
                        .children[document.getElementById('file-list').childElementCount - 1].focus()
                } catch (error) {
                    document
                        .getElementById('folder-grid')
                        .children[document.getElementById('folder-grid').childElementCount - 1].focus()
                }
            }
        }
        /*
        if (event.keyCode == 37) {
            let newObj = get(currentFileList)[get(currentFileList).length - 1]
            document.getElementById(`file-${newObj.path}`).focus()
            window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, get(currentFileList).length - 1])
        } else if (event.keyCode == 39) {
            let newObj = get(currentFileList)[0]
            document.getElementById(`file-${newObj.path}`).focus()
            window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, 0])
        }
        */
    }
}
export const startKeyBoardEvent = () => {
    document.addEventListener('keydown', keyArrowEvent)
}
export const stopKeyBoardEvent = () => {
    document.removeEventListener('keydown', keyArrowEvent)
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
