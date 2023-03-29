<script>
    import { onMount } from 'svelte'
    import File from './File.svelte'
    import {
        currentPath,
        pathHistory,
        currentPathIndex,
        initCurrentSelected,
        currentPathArray,
        zoom,
        currentSelectedFile,
    } from '../state.js'
    let currentFileList = []
    let loadingCursor = false

    window.electron.receive('app:get-path', (arg) => {
        $currentPath = arg
        let splitArg = arg.split('\\')
        if (splitArg[splitArg.length - 1] == '') splitArg.pop()
        $currentPathArray = splitArg
    })

    window.electron.receive('app:get-files', (arg) => {
        arg.sort((a, b) => {
            if (a.type == 'folder') {
                if (b.type == 'folder') {
                    if (a.name < b.name) return -1
                    else if (a.name > b.name) return 1
                    if (a.name == b.name) return 0
                } else return -1
            } else {
                if (a.name < b.name) return -1
                else if (a.name > b.name) return 1
                if (a.name == b.name) return 0
            }
        })
        currentFileList = arg
    })

    window.electron.receive('app:get-file-info', (arg) => {
        $currentSelectedFile = arg
        /*
        if (arg[0] == 'folder') {
            $currentSelectedFile = {
                name: arg[1],
                type: arg[0],
                childCount: arg[2],
            }
        } else {
            $currentSelectedFile = {
                name: arg[1],
                type: arg[0],
                size: arg[2],
            }
        }
        */
    })

    window.electron.receive('app:set-path-history', (arg) => {
        $pathHistory = [...$pathHistory, arg]
    })

    window.electron.receive('app:init-current-Selected', () => {
        initCurrentSelected()
    })

    window.electron.receive('app:set-zoom', (arg) => {
        $zoom = arg
    })

    const getGridColumn = () => {
        const gridComputedStyle = window.getComputedStyle(document.getElementById('folder-grid'))
        return gridComputedStyle.getPropertyValue('grid-template-columns').split(' ').length
    }

    onMount(async () => {
        window.electron.start()
        document.addEventListener('mousedown', (event) => {
            if (event.button == 3) {
                if ($currentPathIndex != 1) {
                    $currentPathIndex -= 1
                    if ($pathHistory.length != 0) {
                        window.electron.setPath($pathHistory[$currentPathIndex - 1])
                    }
                }
            } else if (event.button == 4) {
                if ($pathHistory.length > $currentPathIndex) {
                    $currentPathIndex += 1
                    window.electron.setPath($pathHistory[$currentPathIndex - 1])
                }
            }
        })
        window.electron.receive('app:generating-video-thumb', (event, arg) => {
            loadingCursor = arg
        })
        document.addEventListener('keydown', (event) => {
            event.preventDefault()
            if (event.keyCode == 8) {
                if ($currentPath.length > 3) {
                    window.electron.setPath($currentPath.slice(0, $currentPath.lastIndexOf('\\')))
                    window.electron.setPathHistory($currentPath.slice(0, $currentPath.lastIndexOf('\\')))
                    $currentPathIndex += 1
                }
            }
            if ($currentSelectedFile != null) {
                if (event.keyCode == 37) {
                    if ($currentSelectedFile.index > 0) {
                        let newObj = currentFileList[$currentSelectedFile.index - 1]
                        document.getElementById(`file-${newObj.path}`).focus()
                        window.electron.getFileInfo([
                            newObj.path,
                            newObj.name,
                            newObj.type,
                            $currentSelectedFile.index - 1,
                        ])
                    }
                } else if (event.keyCode == 40) {
                    let columnCount = getGridColumn()
                    if (currentFileList.length > $currentSelectedFile.index + columnCount) {
                        let newObj = currentFileList[$currentSelectedFile.index + columnCount]
                        document.getElementById(`file-${newObj.path}`).focus()
                        window.electron.getFileInfo([
                            newObj.path,
                            newObj.name,
                            newObj.type,
                            $currentSelectedFile.index + columnCount,
                        ])
                    }
                } else if (event.keyCode == 39) {
                    if ($currentSelectedFile.index + 1 < currentFileList.length) {
                        let newObj = currentFileList[$currentSelectedFile.index + 1]
                        document.getElementById(`file-${newObj.path}`).focus()
                        window.electron.getFileInfo([
                            newObj.path,
                            newObj.name,
                            newObj.type,
                            $currentSelectedFile.index + 1,
                        ])
                    }
                } else if (event.keyCode == 38) {
                    let columnCount = getGridColumn()
                    if ($currentSelectedFile.index - columnCount >= 0) {
                        let newObj = currentFileList[$currentSelectedFile.index - columnCount]
                        document.getElementById(`file-${newObj.path}`).focus()
                        window.electron.getFileInfo([
                            newObj.path,
                            newObj.name,
                            newObj.type,
                            $currentSelectedFile.index - columnCount,
                        ])
                    }
                } else if (event.keyCode == 13) {
                    if ($currentSelectedFile.type == 'folder') {
                        window.electron.setPath($currentSelectedFile.path)
                        window.electron.setPathHistory($currentSelectedFile.path)
                        $currentPathIndex += 1
                        $pathHistory = $pathHistory.slice(0, $currentPathIndex)
                    } else {
                        if ($currentPath.length == 3) window.electron.openFile($currentSelectedFile.path)
                        else window.electron.openFile($currentSelectedFile.path)
                    }
                }
            } else {
                if (event.keyCode == 37) {
                    let newObj = currentFileList[currentFileList.length - 1]
                    document.getElementById(`file-${newObj.path}`).focus()
                    window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, currentFileList.length - 1])
                } else if (event.keyCode == 39) {
                    let newObj = currentFileList[0]
                    document.getElementById(`file-${newObj.path}`).focus()
                    window.electron.getFileInfo([newObj.path, newObj.name, newObj.type, 0])
                }
            }
        })
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
    class="fc"
    on:click={() => {
        initCurrentSelected()
    }}
    on:wheel={(event) => {
        if (event.ctrlKey) {
            if (event.deltaY < 0) {
                if ($zoom < 3) {
                    let z = parseFloat(($zoom + 0.05).toFixed(2))
                    window.electron.setZoom(z)
                    $zoom = z
                }
            } else if (event.deltaY > 0) {
                if ($zoom > 0.5) {
                    let z = parseFloat(($zoom - 0.05).toFixed(2))
                    window.electron.setZoom(z)
                    $zoom = z
                }
            }
        }
    }}
    style="cursor:{loadingCursor ? 'progress' : 'auto'}"
>
    <div id="folder-grid-wrapper">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="folder-grid" style="zoom: {$zoom};">
            {#each currentFileList as file, i}
                <File name={file.name} type={file.type} inode={file.inode} index={i} />
            {/each}
        </div>
    </div>
</main>

<style>
    main {
        flex-grow: 1;
        background-color: #ffffff;
        z-index: 500;
    }

    #folder-grid-wrapper {
        overflow: overlay;
        height: calc(100vh - 36rem - 40rem - 40rem);
    }

    #folder-grid-wrapper::-webkit-scrollbar {
        width: 8rem;
    }

    #folder-grid-wrapper::-webkit-scrollbar-thumb {
        background-color: #bebebe;
    }

    #folder-grid-wrapper::-webkit-scrollbar-thumb:hover {
        background-color: #a9a8a8;
    }

    #folder-grid-wrapper::-webkit-scrollbar-thumb:active {
        background-color: #7a7a7a;
    }

    #folder-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 110rem);
        column-gap: auto;
        row-gap: 20rem;
        grid-auto-rows: 130rem;
        margin: 20rem 20rem 20rem 20rem;
    }
</style>
