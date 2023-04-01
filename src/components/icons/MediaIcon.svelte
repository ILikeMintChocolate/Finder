<script>
    import ImageIcon from './ImageIcon.svelte'
    import VideoIcon from './VideoIcon.svelte'
    export let file, index
    let mouseover = false
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    id="file-grid-item-{index}"
    class="file fc"
    on:dblclick={() => {
        window.electron.openFile(file.path)
    }}
    on:mouseover={() => (mouseover = true)}
    on:mouseleave={() => (mouseover = false)}
    draggable="true"
>
    <div>
        {#if file.type == 'image'}
            <ImageIcon {file} {index} on:setLoadedCount />
        {:else if file.type == 'video'}
            <VideoIcon {file} {index} mouseOver={mouseover} on:setLoadedCount />
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
