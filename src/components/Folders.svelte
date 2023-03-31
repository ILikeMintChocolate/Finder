<script>
    import { onMount } from 'svelte'
    import {
        currentPath,
        pathHistory,
        currentPathIndex,
        initCurrentSelected,
        currentPathArray,
        zoom,
        startKeyBoardEvent,
        currentFileList,
        currentFolderList,
    } from '../state.js'
    import File from './File.svelte'
    import FolderIcon from './icons/FolderIcon.svelte'
    let loadingCursor = false,
        loadedCount = 0

    window.electron.receive('app:get-path', (arg) => {
        $currentPath = arg
        let splitArg = arg.split('\\')
        if (splitArg[splitArg.length - 1] == '') splitArg.pop()
        $currentPathArray = splitArg
    })

    window.electron.receive('app:get-files', (arg) => {
        $currentFileList = arg.filter((file) => file.type != 'folder')
        $currentFolderList = arg.filter((file) => file.type == 'folder')
        loadedCount = 0
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

    const setMasonry = () => {
        console.log('setMasonry')
        for (let i = 0; i < $currentFileList.length; i++) {
            const masonryContainerStyle = getComputedStyle(document.getElementById('file-grid'))
            const columnGap = parseInt(masonryContainerStyle.getPropertyValue('column-gap'))
            const autoRows = parseInt(masonryContainerStyle.getPropertyValue('grid-auto-rows'))
            let itemElement = document.getElementById(`file-grid-item-${i}`)
            let itemMediaElement = document.getElementById(`file-grid-media-${i}`)
            itemElement.style.gridRowEnd = `span ${Math.ceil(
                itemMediaElement.scrollHeight / autoRows + columnGap / autoRows
            )}`
        }
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
        startKeyBoardEvent()
    })
    const setLoadedCount = () => {
        if ($currentFileList.length == ++loadedCount) setMasonry()
    }
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
                if ($zoom < 5) {
                    let z = parseFloat(($zoom + 0.1).toFixed(2))
                    window.electron.setZoom(z)
                    $zoom = z
                }
            } else if (event.deltaY > 0) {
                if ($zoom > 0.5) {
                    let z = parseFloat(($zoom - 0.1).toFixed(2))
                    window.electron.setZoom(z)
                    $zoom = z
                }
            }
        }
    }}
    style="cursor:{loadingCursor ? 'progress' : 'auto'}"
>
    <div id="folder-grid-wrapper" class="fc">
        {#if $currentFolderList.length != 0}
            <div class="section-title">Folder</div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div id="folder-grid">
                {#each $currentFolderList as folder}
                    <FolderIcon {folder} />
                {/each}
            </div>
        {/if}
        {#if $currentFileList.length != 0}
            <div class="section-title">Files</div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div id="file-grid" style="zoom: {$zoom};">
                {#each $currentFileList as file, index}
                    <File {file} {index} on:setLoadedCount={setLoadedCount} />
                {/each}
            </div>
        {/if}
    </div>
</main>

<style>
    main {
        flex-grow: 1;
        z-index: 500;
    }

    #folder-grid-wrapper {
        overflow: overlay;
        height: calc(100vh - 80rem);
        padding-left: 30rem;
    }

    #folder-grid-wrapper::-webkit-scrollbar {
        width: 8rem;
    }

    #folder-grid-wrapper::-webkit-scrollbar-thumb {
        background-color: #bebebe;
        border-right: 4rem solid var(--white);
        background-clip: padding-box;
    }

    #folder-grid-wrapper::-webkit-scrollbar-thumb:hover {
        background-color: #a9a8a8;
    }

    #folder-grid-wrapper::-webkit-scrollbar-thumb:active {
        background-color: #7a7a7a;
    }

    #folder-grid {
        position: relative;
        width: calc(100% - 30rem);
        display: grid;
        grid-template-columns: repeat(auto-fill, 150rem);
        gap: 20rem;
        padding-bottom: 20rem;
    }

    #file-grid {
        position: relative;
        width: calc(100% - 30rem);
        display: grid;
        grid-template-columns: repeat(auto-fill, 120rem);
        grid-auto-rows: 10rem;
        column-gap: 20rem;
    }

    .section-title {
        font-size: 14rem;
        color: var(--black);
        font-weight: 500;
        margin: 10rem 0 15rem 0;
    }
</style>
