<script>
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    export let mouseOver = false
    export let file, index
    const dispatch = createEventDispatcher()
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

<main class="fr">
    {#if noThumb == false}
        <img
            id="file-grid-media-{index}"
            src="videothumb://{file.inode}_{videoThumbIndex}"
            alt=""
            on:load={function () {
                this.style.opacity = '1'
                dispatch('setLoadedCount')
            }}
        />
    {/if}
</main>

<style>
    main {
        position: relative;
        width: 150rem;
        height: fit-content;
        min-height: 40rem;
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
