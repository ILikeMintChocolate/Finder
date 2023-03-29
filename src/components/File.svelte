<script>
    import FolderIcon from './icons/FolderIcon.svelte'
    import ImageIcon from './icons/ImageIcon.svelte'
    import VideoIcon from './icons/VideoIcon.svelte'
    import { currentPath, currentPathIndex, pathHistory, initCurrentSelected } from '../state.js'
    import TextIcon from './icons/TextIcon.svelte'
    import AudioIcon from './icons/AudioIcon.svelte'
    import EtcIcon from './icons/EtcIcon.svelte'
    import PdfIcon from './icons/PdfIcon.svelte'
    export let name, type, inode, index
    let mouseOver = false
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    id="file-{$currentPath}\{name}"
    tabindex={0}
    class="fc file"
    on:mouseover={function () {
        mouseOver = true
    }}
    on:mouseleave={function () {
        mouseOver = false
    }}
    on:click={function (event) {
        this.focus()
        window.electron.getFileInfo([`${$currentPath}\\${name}`, name, type, index])
        event.stopPropagation()
    }}
    on:dblclick={() => {
        //initCurrentSelected()
        if (type == 'folder') {
            window.electron.setPath(`${$currentPath}\\${name}`)
            window.electron.setPathHistory(`${$currentPath}\\${name}`)
            $currentPathIndex += 1
            $pathHistory = $pathHistory.slice(0, $currentPathIndex)
        } else {
            if ($currentPath.length == 3) window.electron.openFile(`${$currentPath}${name}`)
            else window.electron.openFile(`${$currentPath}\\${name}`)
        }
    }}
    on:dragstart={() => {
        //window.electron.dragFile(`${$currentPath}\\${name}`)
    }}
    draggable="true"
>
    <div class="fileIcon">
        {#if type == 'folder'}
            <FolderIcon path={`${$currentPath}\\${name}`} />
        {:else if type == 'image'}
            <ImageIcon {inode} path={`${$currentPath}\\${name}`} />
        {:else if type == 'text'}
            <TextIcon />
        {:else if type == 'video'}
            <VideoIcon {inode} path={`${$currentPath}\\${name}`} {mouseOver} />
        {:else if type == 'audio'}
            <AudioIcon {inode} path={`${$currentPath}\\${name}`} {mouseOver} />
        {:else if type == 'pdf'}
            <PdfIcon />
        {:else if type == 'etc'}
            <EtcIcon />
        {/if}
    </div>

    <div class="fileName noto no-drag">
        {name}
    </div>
</div>

<style>
    .file {
        width: 90rem;
        height: 130rem;
        border-radius: 2rem;
        transition: box-shadow 0.15s ease-out;
    }
    .file:focus {
        box-shadow: 0rem 0rem 0rem 1rem #82c2ff !important;
        background-color: #e4f2ff;
        outline: none;
    }
    .file:hover {
        box-shadow: 0rem 0rem 0rem 1rem #bbdeff;
    }

    .fileIcon {
        height: 90rem;
    }

    .fileName {
        font-size: 11rem;
        text-align: center;
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        overflow: hidden;
        max-height: 40rem;
        line-height: 20rem;
    }
</style>
