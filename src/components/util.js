export const getParentPath = (path) => {
    if (path.length <= 4) return false
    return path.split('\\').slice(0, -1).join('\\')
}
