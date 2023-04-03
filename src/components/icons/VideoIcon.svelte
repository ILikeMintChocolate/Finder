<script>
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { currentSelectedFile } from '../../state'
    export let mouseOver = false
    export let file, index
    const dispatch = createEventDispatcher()
    let preMouseOver = false
    let mouseOverEvent
    let videoThumbIndex = 1
    const startMouseOverEvent = () => {
        console.log('start')
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
    class="fr"
    on:click={function (event) {
        this.focus()
        console.log(file)
        $currentSelectedFile = file
        event.stopPropagation()
    }}
>
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
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 7L0.499999 13.0622L0.5 0.937822L11 7Z" fill="#FFE602" />
    </svg>
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
    svg {
        position: absolute;
        top: 6rem;
        right: 6rem;
        z-index: 100;
    }
</style>
