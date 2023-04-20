<script>
    import { onMount } from 'svelte'
    import {
        pathHistory,
        currentPathIndex,
        initCurrentSelected,
        zoom,
        startKeyBoardEvent,
        currentFileList,
        currentFolderList,
        currentImageList,
        currentVideoList,
        searchOption,
        loadingCursor,
        editMode,
    } from '../state.js'
    import LineFile from './icons/files/LineFile.svelte'
    import LineFolder from './icons/files/LineFolder.svelte'
    import ImageIcon from './icons/files/ImageIcon.svelte'
    import VideoIcon from './icons/files/VideoIcon.svelte'
    let detailOpen1 = false,
        detailOpen2 = false,
        detailOpen3 = false

    onMount(async () => {
        startKeyBoardEvent()
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
    class="fc"
    on:click={() => {
        if ($editMode == true) $editMode = false
        initCurrentSelected()
    }}
    on:wheel={(event) => {
        if (event.ctrlKey) {
            if (event.deltaY < 0) {
                if ($zoom < 5) $zoom = parseFloat(($zoom + 0.1).toFixed(2))
            } else if (event.deltaY > 0) {
                if ($zoom > 0.5) $zoom = parseFloat(($zoom - 0.1).toFixed(2))
            }
        }
    }}
    on:mousedown={(event) => {
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
        event.stopPropagation()
    }}
    style="cursor:{$loadingCursor ? 'progress' : 'auto'}"
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
                <div id="folder-list" class="fc folder-grid">
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
                <div id="file-list" class="fc folder-grid">
                    {#each $currentFileList as file}
                        {#if $searchOption.ext.length == 0 || $searchOption.ext.includes(file.type.split('/')[0]) || $searchOption.ext.includes(file.type.split('/')[1])}
                            {#if $searchOption.tag.length == 0 || $searchOption.tag.filter( (t) => file.tag.includes(t) ).length != 0}
                                {#if $searchOption.rate.includes(true) == false || $searchOption.rate[file.rate - 1] == true}
                                    <LineFile {file} />
                                {/if}
                            {/if}
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
                    {#if $searchOption.ext.includes('video') || !$searchOption.ext.length}
                        {#each $currentVideoList as file}
                            {#if !$searchOption.tag.length || $searchOption.tag.every((t) => file.tag.includes(t))}
                                {#if !$searchOption.rate.includes(true) || $searchOption.rate[file.rate - 1]}
                                    <VideoIcon {file} />
                                {/if}
                            {/if}
                        {/each}
                    {/if}
                    {#if $searchOption.ext.includes('image') || !$searchOption.ext.length}
                        {#each $currentImageList as file}
                            {#if !$searchOption.tag.length || $searchOption.tag.every((t) => file.tag.includes(t))}
                                {#if !$searchOption.rate.includes(true) || $searchOption.rate[file.rate - 1]}
                                    <ImageIcon {file} />
                                {/if}
                            {/if}
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
        overflow-y: scroll;
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

    .folder-grid {
        position: relative;
        width: calc(100% - 30rem);
    }

    #file-grid {
        position: relative;
        width: calc(100% - 30rem);
        display: grid;
        grid-template-columns: repeat(auto-fill, 150rem);
        gap: 20rem;
        height: max-content;
        padding-bottom: 30rem;
    }

    .section-title {
        font-size: 14rem;
        color: var(--black);
        font-weight: 500;
        margin: 10rem 30rem 10rem 0;
    }

    details {
        margin-bottom: 20rem;
    }
</style>
