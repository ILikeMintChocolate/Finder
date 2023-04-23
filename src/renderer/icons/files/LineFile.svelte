<script>
    import { setCurrentSelectedFile } from '../../state'
    import PdfIcon from './PdfIcon.svelte'
    import TextIcon from './TextIcon.svelte'
    import ZipIcon from './ZipIcon.svelte'
    import EtcIcon from './EtcIcon.svelte'
    import AudioIcon from './AudioIcon.svelte'
    export let file
    let [extType, extDetail] = file.type.split('/')
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    id="file-{file.id}"
    class="folder-icon fr fleft no-drag"
    tabindex="0"
    draggable="true"
    on:click={(event) => {
        setCurrentSelectedFile(file)
        event.stopPropagation()
    }}
    on:dblclick={() => {
        window.electron.openFile(file.path)
    }}
    on:dragstart={(event) => {
        event.stopPropagation()
        event.preventDefault()
        window.electron.dragFile(file.path)
    }}
>
    {#if extType == 'audio'}
        <AudioIcon />
    {:else if extType == 'text'}
        <TextIcon />
    {:else if extDetail == 'pdf'}
        <PdfIcon />
    {:else if extDetail == 'zip'}
        <ZipIcon />
    {:else if extDetail == 'etc'}
        <EtcIcon />
    {/if}
    <span>{file.name}</span>
</div>

<style>
    .folder-icon {
        position: relative;
        width: calc(100% - 16rem);
        height: 32rem;
        gap: 10rem;
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
