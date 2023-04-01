<script>
    import TextIcon from './TextIcon.svelte'
    import AudioIcon from './AudioIcon.svelte'
    import EtcIcon from './EtcIcon.svelte'
    import PdfIcon from './PdfIcon.svelte'
    import { currentSelectedFile } from '../../state'
    export let file
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    class="folder-icon fr no-drag"
    draggable="true"
    tabindex="0"
    on:click={function (event) {
        $currentSelectedFile = file
        event.stopPropagation()
        this.focus()
    }}
    on:dblclick={() => {
        window.electron.openFile(file.path)
    }}
>
    {#if file.type == 'text'}
        <TextIcon />
    {:else if file.type == 'audio'}
        <AudioIcon {file} />
    {:else if file.type == 'pdf'}
        <PdfIcon />
    {:else if file.type == 'etc'}
        <EtcIcon />
    {/if}
    <div class="fc fcenter" style="margin-right: 12rem;"><span>{file.name}</span></div>
</div>

<style>
    .folder-icon {
        width: 150rem;
        height: 80rem;
        border: 1rem solid transparent;
    }
    .folder-icon:focus {
        border: 1rem solid #08c4fd !important;
    }
    .folder-icon:hover {
        border: 1rem solid #c4e6f0;
    }

    .folder-icon div span {
        position: relative;
        width: calc(100%);
        color: var(--black);
        font-size: 12rem;
        font-family: 'Roboto', 'Noto Sans kr', sans-serif;

        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        white-space: normal;
        line-height: 1.6;
        height: 4.8em;
    }
</style>
