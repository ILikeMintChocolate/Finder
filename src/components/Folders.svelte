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
        currentImageList,
        currentVideoList,
        extensionList,
        searchOption,
    } from '../state.js'
    import LineFile from './icons/files/LineFile.svelte'
    import LineFolder from './icons/files/LineFolder.svelte'
    import ImageIcon from './icons/files/ImageIcon.svelte'
    import VideoIcon from './icons/files/VideoIcon.svelte'
    let loadingCursor = false,
        detailOpen1 = false,
        detailOpen2 = false,
        detailOpen3 = false,
        loadedCount = 0

    window.electron.receive('app:get-path', (arg) => {
        $currentPath = arg
        let splitArg = arg.path.split('\\')
        if (splitArg[splitArg.length - 1] == '') splitArg.pop()
        $currentPathArray = splitArg.filter((p) => p != '')
    })

    window.electron.receive('app:get-files', (arg) => {
        $extensionList = arg[1]
        let folderList = [],
            imageList = [],
            videoList = [],
            fileList = []
        arg[0].forEach((file) => {
            let type = file.type.split('/')[0]
            if (type == 'folder') folderList.push(file)
            else if (type == 'image') imageList.push(file)
            else if (type == 'video') videoList.push(file)
            else fileList.push(file)
        })
        $currentFolderList = folderList
        $currentImageList = imageList
        $currentVideoList = videoList
        $currentFileList = fileList
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
                <div id="folder-grid" class="fc">
                    {#each $currentFolderList as folder}
                        <LineFolder {folder} />
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
                <div id="folder-grid" class="fc">
                    {#each $currentFileList as file}
                        {#if $searchOption.ext.length == 0 || $searchOption.ext.includes(file.type.split('/')[0]) || $searchOption.ext.includes(file.type.split('/')[1])}
                            <LineFile {file} />
                        {/if}
                    {/each}
                </div>
            </details>
        {/if}
        {#if $currentImageList.length + $currentVideoList.length != 0}
            <details
                open
                on:toggle={function () {
                    this.open ? (detailOpen3 = false) : (detailOpen3 = true)
                }}
            >
                <summary class="section-title no-drag">&nbsp;Media</summary>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div id="file-grid" style="zoom: {$zoom};">
                    {#if $searchOption.ext.includes('video') || $searchOption.ext.length == 0}
                        {#each $currentVideoList as file}
                            <VideoIcon {file} />
                        {/each}
                    {/if}
                    {#if $searchOption.ext.includes('image') || $searchOption.ext.length == 0}
                        {#each $currentImageList as file}
                            <ImageIcon {file} />
                        {/each}
                    {/if}
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
    }

    #file-grid {
        position: relative;
        width: calc(100% - 30rem);
        display: grid;
        grid-template-columns: repeat(auto-fill, 150rem);
        gap: 30rem;
    }

    .section-title {
        font-size: 14rem;
        color: var(--black);
        font-weight: 500;
        margin: 10rem 30rem 5rem 0;
    }

    details {
        margin-bottom: 20rem;
    }
</style>
