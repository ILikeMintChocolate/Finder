import { writable } from 'svelte/store'

export const contextMenu = writable(false)
export const contextMenuType = writable(null)
export const showContextMenu = (type, eventX, eventY) => {
    let contextMenuElement = document.getElementById('context-menu-wrapper')
    if (eventX + 150 >= window.innerWidth) {
        contextMenuElement.style.left = 'auto'
        contextMenuElement.style.right = '10rem'
    } else {
        contextMenuElement.style.left = `${eventX}rem`
        contextMenuElement.style.right = 'auto'
    }
    if (eventY + contextMenuElement.getBoundingClientRect().height >= window.outerHeight) {
        contextMenuElement.style.top = `${eventY - contextMenuElement.getBoundingClientRect().height}rem`
    } else contextMenuElement.style.top = `${eventY}rem`
    contextMenu.set(true)
    contextMenuType.set(type)
    // type = background, folder, file
}
export const hideContextMenu = () => {
    let contextMenuElement = document.getElementById('context-menu-wrapper')
    contextMenuElement.style.right = '0rem'
    contextMenuElement.style.left = '0rem'
    contextMenu.set(false)
    contextMenuType.set(null)
}
