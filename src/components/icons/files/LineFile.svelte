<script>
    import { currentSelectedFile } from '../../../state'
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
    id="file-{file.inode}"
    class="folder-icon fr fleft no-drag"
    tabindex="0"
    on:click={(event) => {
        $currentSelectedFile = file
        event.stopPropagation()
    }}
    on:dblclick={() => {
        window.electron.openFile(file.path)
    }}
    on:focus={() => {
        $currentSelectedFile = file
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
