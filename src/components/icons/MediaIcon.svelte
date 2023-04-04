<script>
    //import VideoIcon from './files/VideoIcon.svelte'
    export let file
    let mouseover = false
    let type = file.type.split('/')[0]
    console.log(type)
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    id="file-grid-item-{file.inode}"
    class="file fc"
    on:dblclick={() => {
        window.electron.openFile(file.path)
    }}
    on:mouseover={() => (mouseover = true)}
    on:mouseleave={() => (mouseover = false)}
    draggable="true"
>
    <div>
        <!--<VideoIcon {file} mouseOver={mouseover} on:setLoadedCount />-->
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
