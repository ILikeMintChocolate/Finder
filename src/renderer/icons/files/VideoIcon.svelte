<script>
    import { onMount } from 'svelte'
    import { showContextMenu, hideContextMenu } from '../../ui'
    import { setCurrentSelectedFile } from '../../state'
    import { edit } from '../../edit'
    export let mouseOver = false
    export let file
    let preMouseOver = false
    let mouseOverEvent
    let videoThumbIndex = 1
    const startMouseOverEvent = () => {
        mouseOverEvent = setInterval(() => {
            videoThumbIndex = (videoThumbIndex % 6) + 1
        }, 500)
    }
    const finishMouseOverEvent = () => {
        videoThumbIndex = 1
        clearInterval(mouseOverEvent)
    }
    $: {
        if (mouseOver != preMouseOver) {
            if (mouseOver == true) {
                startMouseOverEvent()
            } else {
                finishMouseOverEvent()
            }
            preMouseOver = mouseOver
        }
    }
    let noThumb = true
    onMount(async () => {
        window.electron.findVideoThumb([file.inode, file.path])
        window.electron.receive('app:find-video-thumb', () => {
            noThumb = false
        })
    })
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    id="file-{file.id}"
    class="file no-drag"
    tabindex="0"
    draggable="true"
    on:click={(event) => {
        edit.finishEdit()
        setCurrentSelectedFile(file)
        event.stopPropagation()
    }}
    on:dblclick={() => window.electron.openFile(file.path)}
    on:dragstart={(event) => {
        event.stopPropagation()
        event.preventDefault()
        window.electron.dragFile(file.path)
    }}
    on:mousedown={function (event) {
        if (event.button != 2) {
            hideContextMenu()
        } else {
            showContextMenu('file', event.clientX, event.clientY)
            edit.finishEdit()
            setCurrentSelectedFile(file)
            event.stopPropagation()
            event.preventDefault()
        }
    }}
>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    {#if noThumb == false}
        <img
            id="file-grid-media-{file.inode}"
            src="videothumb://{file.inode}_{videoThumbIndex}"
            alt=""
            class="vcenter"
            on:load={function () {
                this.style.opacity = '1'
                if (this.naturalWidth > this.naturalHeight) this.parentElement.style.gridColumn = 'span 2'
                else this.parentElement.style.gridColumn = 'span 1'
            }}
            on:mouseover={() => (mouseOver = true)}
            on:mouseleave={() => (mouseOver = false)}
        />
    {/if}
    <svg
        width="11"
        height="14"
        viewBox="0 0 11 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="visibility: {mouseOver ? 'hidden' : 'visible'};"
    >
        <path d="M11 7L0.499999 13.0622L0.5 0.937822L11 7Z" fill="#FFE602" />
    </svg>
</div>

<style>
    .file {
        position: relative;
        width: 100%;
        height: 230rem;
        background-color: black;
    }
    img {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 20;
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
    svg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
    }
</style>
