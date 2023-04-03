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
        currentMediaList,
        extensionList,
        selectedExtension,
    } from '../state.js'
    import FileIcon from './icons/FileIcon.svelte'
    import FolderIcon from './icons/FolderIcon.svelte'
    import MediaIcon from './icons/MediaIcon.svelte'
    let loadingCursor = false,
        detailOpen1 = false,
        detailOpen2 = false,
        detailOpen3 = false,
        loadedCount = 0

    window.electron.receive('app:get-path', (arg) => {
        $currentPath = arg
        let splitArg = arg.split('\\')
        if (splitArg[splitArg.length - 1] == '') splitArg.pop()
        $currentPathArray = splitArg.filter((p) => p != '')
    })

    window.electron.receive('app:get-files', (arg) => {
        console.log(arg[1])
        $extensionList = arg[1]
        $currentFolderList = arg[0].filter((file) => file.type == 'folder')
        $currentMediaList = arg[0]
            .filter((file) => file.type == 'image' || file.type == 'video')
            .sort((a, b) => {
                if (a.type == 'video') return -1
                else return 1
            })
        $currentFileList = arg[0].filter(
            (file) => file.type != 'image' && file.type != 'video' && file.type != 'folder'
        )
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
        for (let i = 0; i < $currentMediaList.length; i++) {
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
        window.electron.receive('app:generating-video-thumb', (arg) => {
            loadingCursor = arg
        })
        startKeyBoardEvent()
    })
    const setLoadedCount = () => {
        if ($currentMediaList.length == ++loadedCount) setMasonry()
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
            <details
                open
                on:toggle={function () {
                    this.open ? (detailOpen1 = false) : (detailOpen1 = true)
                }}
            >
                <summary class="section-title no-drag">&nbsp;Folder</summary>
                <div id="folder-grid">
                    {#each $currentFolderList as folder}
                        <FolderIcon {folder} />
                    {/each}
                </div>
            </details>
        {/if}
        {#if $currentFileList.length != 0}
            <details
                open
                on:toggle={function () {
                    this.open ? (detailOpen2 = false) : (detailOpen2 = true)
                }}
            >
                <summary class="section-title no-drag">&nbsp;File</summary>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div id="folder-grid">
                    {#each $currentFileList as file}
                        {#if $selectedExtension.length == 0 || $selectedExtension.includes(file.type)}
                            <FileIcon {file} />
                        {/if}
                    {/each}
                </div>
            </details>
        {/if}
        {#if $currentMediaList.length != 0}
            <details
                open
                on:toggle={function () {
                    this.open ? (detailOpen3 = false) : (detailOpen3 = true)
                }}
            >
                <summary class="section-title no-drag">&nbsp;Media</summary>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div id="file-grid" style="zoom: {$zoom};">
                    {#each $currentMediaList as file, index}
                        {#if $selectedExtension.length == 0 || $selectedExtension.includes(file.type)}
                            <MediaIcon {file} {index} on:setLoadedCount={setLoadedCount} />
                        {/if}
                    {/each}
                </div>
            </details>
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
    }

    #file-grid {
        position: relative;
        width: calc(100% - 30rem);
        display: grid;
        grid-template-columns: repeat(auto-fill, 150rem);
        grid-auto-rows: 10rem;
        column-gap: 20rem;
    }

    .section-title {
        font-size: 14rem;
        color: var(--black);
        font-weight: 500;
        margin: 10rem 30rem 15rem 0;
        padding-bottom: 5rem;
    }

    details {
        margin-bottom: 20rem;
    }
</style>
