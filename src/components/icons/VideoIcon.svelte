<script>
    import { onMount } from 'svelte'
    export let mouseOver = false
    export let file
    let preMouseOver = false
    let mouseOverEvent
    let videoThumbIndex = 1
    const startMouseOverEvent = () => {
        mouseOverEvent = setInterval(function () {
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

<main class="fr">
    {#if noThumb == false}
        <img
            src="videothumb://{file.inode}_{videoThumbIndex}"
            alt=""
            on:load={function () {
                this.style.opacity = '1'
            }}
        />
    {/if}
</main>

<style>
    main {
        position: relative;
        width: 120rem;
        background-color: var(--black);
    }
    img {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 20;
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
</style>
