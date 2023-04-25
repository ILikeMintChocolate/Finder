<script>
    import { currentSelectedFile, currentPath, snackbars, copyFile, snackbarsIndex } from '../state'
    import { contextMenu, contextMenuType, hideContextMenu } from '../ui'
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="context-menu-wrapper" class="fc" style:visibility={$contextMenu ? 'visible' : 'hidden'}>
    <ul>
        {#if ['folder', 'file'].includes($contextMenuType)}
            <li
                class="no-drag"
                on:click={() => {
                    if ($contextMenuType == 'folder') window.electron.newPage($currentSelectedFile.path)
                    else window.electron.openFile($currentSelectedFile.path)
                    hideContextMenu()
                }}
            >
                Open
            </li>
        {/if}
        {#if ['background'].includes($contextMenuType)}
            <li
                class="no-drag"
                on:click={() => {
                    window.electron.makeFolder()
                    hideContextMenu()
                }}
            >
                New Folder
            </li>
        {/if}
        <li
            class="no-drag"
            on:click={() => {
                if ($currentSelectedFile) window.electron.revealInExplorer($currentSelectedFile.path)
                else window.electron.openFile($currentPath.path)
                hideContextMenu()
            }}
        >
            Reveal in Explorer
        </li>
    </ul>
    <div class="hr" />
    <ul>
        {#if ['folder', 'file'].includes($contextMenuType)}
            <li
                class="no-drag"
                on:click={() => {
                    hideContextMenu()
                    $copyFile = {
                        name: $currentSelectedFile.name,
                        path: $currentSelectedFile.path,
                        type: $currentSelectedFile.type,
                    }
                    $snackbars = [
                        ...$snackbars,
                        {
                            message: 'Copying',
                            type: 'copy-file',
                            time: -1,
                            index: $snackbarsIndex,
                        },
                    ]
                    $snackbarsIndex++
                }}
            >
                Copy
            </li>
        {/if}
        {#if $copyFile != null}
            <li
                class="no-drag"
                on:click={() => {
                    hideContextMenu()
                    $snackbars = $snackbars.filter((s) => {
                        if (s.type == 'copy-file') {
                            let currentSnackbar = document.getElementById(`snackbar-${s.index}`)
                            currentSnackbar.parentNode.removeChild(currentSnackbar)
                            return false
                        }
                        return true
                    })
                    if ($copyFile.type == 'folder/folder') window.electron.copyFolder($copyFile)
                    else window.electron.copyFile($copyFile)
                    $copyFile = null
                }}
            >
                Paste
            </li>
        {/if}
        <li
            class="no-drag"
            on:click={() => {
                window.electron.copyPath($currentSelectedFile.path)
                hideContextMenu()
                $snackbars = [
                    ...$snackbars,
                    {
                        message: 'Copied Path',
                        type: 'message',
                        time: 3000,
                        index: $snackbarsIndex,
                    },
                ]
                $snackbarsIndex++
            }}
        >
            Copy Path
        </li>
    </ul>
    {#if ['folder', 'file'].includes($contextMenuType)}
        <div class="hr" />
        <ul>
            <li
                class="no-drag"
                on:click={() => {
                    hideContextMenu()
                    window.electron.command()
                }}
            >
                Rename
            </li>
            <li
                class="no-drag"
                on:click={() => {
                    window.electron.deleteFile($currentSelectedFile.path)
                    hideContextMenu()
                    $snackbars = [
                        ...$snackbars,
                        {
                            message: 'Deleted',
                            type: 'message',
                            time: 3000,
                            index: $snackbarsIndex,
                        },
                    ]
                    $snackbarsIndex++
                }}
            >
                Delete
            </li>
        </ul>
    {/if}
</div>

<style>
    #context-menu-wrapper {
        position: absolute;
        width: 150rem;
        box-sizing: border-box;
        z-index: 100000;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: saturate(180%) blur(10rem);
    }
    ul {
        padding: 0;
        list-style-type: none;
        padding: 8rem 0 8rem 0;
    }
    li {
        font-size: 12rem;
        line-height: 26rem;
        padding: 0 20rem 0 20rem;
        color: #ffffff;
        transition: background-color 0.2s;
    }
    li:hover {
        background-color: #00a3ff;
    }
    .hr {
        width: 100%;
        height: 1rem;
        background-color: rgba(61, 61, 61, 0.8);
        backdrop-filter: saturate(180%) blur(10rem);
    }
</style>
