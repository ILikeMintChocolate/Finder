<script>
    import { currentPathIndex, currentSelectedFile, pathHistory } from '../../../state'
    import FolderIcon from './FolderIcon.svelte'
    export let folder
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    id="file-{folder.inode}"
    class="folder-icon fr fleft no-drag"
    tabindex="0"
    on:click={(event) => {
        $currentSelectedFile = folder
        event.stopPropagation()
    }}
    on:dblclick={() => {
        window.electron.setPath(folder.path)
        window.electron.setPathHistory(folder.path)
        $currentPathIndex += 1
        $pathHistory = $pathHistory.slice(0, $currentPathIndex)
    }}
    on:focus={() => ($currentSelectedFile = folder)}
>
    <FolderIcon />
    <span>{folder.name}</span>
</div>

<style>
    .folder-icon {
        position: relative;
        width: calc(100% - 16rem);
        height: 32rem;
        gap: 14rem;
        padding-left: 16rem;
    }
    .folder-icon:focus {
        background-color: #cbf3ff !important;
        outline: 1rem solid #baefff;
    }
    .folder-icon:hover {
        background-color: #e6f8fd;
    }
    span {
        position: relative;
        color: var(--black);
        font-size: 13rem;
        line-height: 32rem;
    }
</style>
