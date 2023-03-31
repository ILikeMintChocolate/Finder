<script>
    import { currentPathIndex, currentSelectedFile, pathHistory } from '../../state'
    export let folder
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    class="folder-icon fr no-drag"
    tabindex="0"
    on:click={function (event) {
        $currentSelectedFile = folder
        event.stopPropagation()
        this.focus()
    }}
    on:dblclick={() => {
        window.electron.setPath(folder.path)
        window.electron.setPathHistory(folder.path)
        $currentPathIndex += 1
        $pathHistory = $pathHistory.slice(0, $currentPathIndex)
    }}
>
    <svg class="vcenter" width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H9.12L12 3.5H24V30H0V0Z" fill="#83E0FD" />
    </svg>
    <span>{folder.name}</span>
</div>

<style>
    .folder-icon {
        width: 150rem;
        height: 50rem;
        border: 1rem solid #e6e6e6;
    }
    .folder-icon:focus {
        border: 1rem solid #08c4fd !important;
    }
    .folder-icon:hover {
        border: 1rem solid #c4e6f0;
    }

    .folder-icon svg {
        margin: 0 12rem 0 12rem;
    }

    .folder-icon span {
        line-height: 50rem;
        color: var(--black);
        font-size: 12rem;
        font-family: 'Roboto', 'Noto Sans kr', sans-serif;
    }
</style>
