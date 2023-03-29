import { writable, get } from 'svelte/store'

export const currentPath = writable('')
export const currentPathIndex = writable(1)
export const currentPathArray = writable([])
export const pathHistory = writable([])
export const currentSelectedFile = writable(null)
export const initCurrentSelected = () => {
    document.activeElement.blur()
    currentSelectedFile.set(null)
}
export const zoom = writable(1)
