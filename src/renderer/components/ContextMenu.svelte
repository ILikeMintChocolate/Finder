<script>
    import { currentSelectedFile, currentPath } from '../state'
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
    <hr />
    <ul>
        {#if ['folder', 'file'].includes($contextMenuType)}
            <li class="no-drag">Copy</li>
        {/if}
        <li class="no-drag">Paste</li>
        <li class="no-drag">Copy Path</li>
    </ul>
    {#if ['folder', 'file'].includes($contextMenuType)}
        <hr />
        <ul>
            <li class="no-drag">Rename</li>
            <li
                class="no-drag"
                on:click={() => {
                    window.electron.deleteFile($currentSelectedFile.path)
                    hideContextMenu()
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
        background-color: #282828;
        z-index: 100000;
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
    hr {
        width: 100%;
        box-sizing: border-box;
        border: 1rem solid #373737;
    }
</style>
