<script>
    import { setCurrentSelectedFile } from '../../../state'
    import FolderIcon from './FolderIcon.svelte'
    export let folder
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    id="file-{folder.id}"
    class="folder-icon fr fleft no-drag"
    tabindex="0"
    on:click={(event) => {
        setCurrentSelectedFile(folder)
        event.preventDefault()
        event.stopImmediatePropagation()
    }}
    on:dblclick={() => window.electron.newPage(folder.path)}
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
        border: 1rem transparent;
        box-sizing: border-box;
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
