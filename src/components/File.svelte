<script>
    import FolderIcon from './icons/FolderIcon.svelte'
    import ImageIcon from './icons/ImageIcon.svelte'
    import VideoIcon from './icons/VideoIcon.svelte'
    import TextIcon from './icons/TextIcon.svelte'
    import AudioIcon from './icons/AudioIcon.svelte'
    import EtcIcon from './icons/EtcIcon.svelte'
    import PdfIcon from './icons/PdfIcon.svelte'
    import { currentSelectedFile } from '../state'
    export let file, index
    let mouseOver = false
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    id="file-grid-item-{index}"
    class="file"
    on:mouseover={function () {
        mouseOver = true
    }}
    on:mouseleave={function () {
        mouseOver = false
    }}
    on:click={function (event) {
        $currentSelectedFile = file
        this.focus()
        event.stopPropagation()
    }}
    on:dblclick={() => {
        window.electron.openFile(file.path)
    }}
    draggable="true"
>
    <div>
        {#if file.type == 'folder'}
            <FolderIcon />
        {:else if file.type == 'image'}
            <ImageIcon {file} {index} on:setLoadedCount />
        {:else if file.type == 'text'}
            <TextIcon />
        {:else if file.type == 'video'}
            <VideoIcon {file} {mouseOver} />
        {:else if file.type == 'audio'}
            <AudioIcon {file} {mouseOver} />
        {:else if file.type == 'pdf'}
            <PdfIcon />
        {:else if file.type == 'etc'}
            <EtcIcon />
        {/if}
    </div>

    <!--
    <div class="fileName noto no-drag">
        {name}
    </div>
    -->
</div>

<style>
    .file {
        width: 120rem;
        height: fit-content;
        transition: box-shadow 0.15s ease-out;
    }

    .file:focus {
        box-shadow: 0rem 0rem 0rem 01rem #82c2ff !important;
        background-color: #e4f2ff;
        outline: none;
    }
    .file:hover {
        box-shadow: 0rem 0rem 0rem 1rem #bbdeff;
    }
</style>
