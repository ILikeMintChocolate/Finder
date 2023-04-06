<script>
    import { onMount } from 'svelte'
    import { currentSelectedFile } from '../../../state'
    export let mouseOver = false
    export let file
    let preMouseOver = false
    let mouseOverEvent
    let videoThumbIndex = 1
    const startMouseOverEvent = () => {
        mouseOverEvent = setInterval(() => {
            videoThumbIndex = (videoThumbIndex % 6) + 1
        }, 700)
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
    id="file-{file.inode}"
    class="file no-drag"
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
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    {#if noThumb == false}
        <img
            id="file-grid-media-{file.inode}"
            src="videothumb://{file.inode}_{videoThumbIndex}"
            alt=""
            class="vcenter"
            on:load={function () {
                this.style.opacity = '1'
                if (this.clientWidth > this.clientHeight) {
                    this.parentElement.style.gridColumn = 'span 2'
                }
            }}
            on:mouseover={() => (mouseOver = true)}
            on:mouseleave={() => (mouseOver = false)}
        />
    {/if}
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 7L0.499999 13.0622L0.5 0.937822L11 7Z" fill="#FFE602" />
    </svg>
</div>

<style>
    .file {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 40rem;
    }
    .file:focus {
        outline: 1rem solid #18a1ca;
    }
    img {
        position: relative;
        width: 100%;
        height: auto;
        z-index: 20;
        opacity: 0;
        transition: opacity 0.25s ease-out;
        object-fit: cover;
        z-index: 10;
    }
    svg {
        position: absolute;
        top: 6rem;
        right: 6rem;
        z-index: 100;
    }
</style>
