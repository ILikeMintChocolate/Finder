<script>
    import FolderIcon from './icons/FolderIcon.svelte'
    import ImageIcon from './icons/ImageIcon.svelte'
    import VideoIcon from './icons/VideoIcon.svelte'
    import TextIcon from './icons/TextIcon.svelte'
    import AudioIcon from './icons/AudioIcon.svelte'
    import EtcIcon from './icons/EtcIcon.svelte'
    import PdfIcon from './icons/PdfIcon.svelte'
    export let file, index
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    id="file-grid-item-{index}"
    class="file fc"
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
            <VideoIcon {file} {index} on:setLoadedCount />
        {:else if file.type == 'audio'}
            <AudioIcon {file} />
        {:else if file.type == 'pdf'}
            <PdfIcon />
        {:else if file.type == 'etc'}
            <EtcIcon />
        {/if}
    </div>
</div>

<style>
    .file {
        position: relative;
        width: 150rem;
        height: fit-content;
        transition: filter 0.1s ease-in-out;
    }
</style>
