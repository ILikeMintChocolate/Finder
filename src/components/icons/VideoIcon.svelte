<script>
    import { onMount } from 'svelte'
    export let inode, path
    export let mouseOver = false
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
        window.electron.findVideoThumb([inode, path])
        window.electron.receive('app:find-video-thumb', () => {
            noThumb = false
        })
    })
</script>

<main class="fr">
    <svg
        class="video-icon-svg"
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="z-index: 10;"
    >
        <rect x="19" y="20" width="52" height="50" fill="#121212" style="z-index: 10;" />
    </svg>
    <svg
        class="video-icon-svg"
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="z-index: 30;"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.6364 20H19L19 70H13.6364C12 70 10 68.5 10 66V24C10 21.5 12 20 13.6364 20ZM13 26H16V29H13V26ZM16 33H13V36H16V33ZM13 40H16V43H13V40ZM16 47H13V50H16V47ZM13 54H16V57H13V54ZM16 61H13V64H16V61Z"
            fill="black"
            fill-opacity="0.5"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M76.3636 70H71V20H76.3636C78 20 80 21.5 80 24V66C80 68.5 78 70 76.3636 70ZM74 26H77V29H74V26ZM77 33H74V36H77V33ZM74 40H77V43H74V40ZM77 47H74V50H77V47ZM74 54H77V57H74V54ZM77 61H74V64H77V61Z"
            fill="black"
            fill-opacity="0.5"
        />
    </svg>
    {#if noThumb == false}
        <img
            src="videothumb://{inode}_{videoThumbIndex}"
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
        width: 90rem;
        height: 90rem;
    }
    .video-icon-svg {
        position: absolute;
        left: 0rem;
        top: 0rem;
    }
    img {
        position: absolute;
        left: 10rem;
        top: 20rem;
        width: 70rem;
        height: 50rem;
        object-fit: cover;
        border-radius: 4rem;
        z-index: 20;
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
</style>
