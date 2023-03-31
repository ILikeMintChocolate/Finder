<script>
    import { onMount } from 'svelte'
    export let file
    export let mouseOver = false
    let noThumb = true

    onMount(async () => {
        window.electron.findAudioThumb([file.inode, file.path])
        window.electron.receive('app:find-audio-thumb', (arg) => {
            if (inode == arg[0]) {
                if (arg[1] == true) {
                    noThumb = false
                }
            }
        })
    })
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<main class="fr fcenter no-drag">
    <svg
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="opacity: {mouseOver ? '1' : '0'};"
    >
        <path d="M53 45L41 51.9282V38.0718L53 45Z" fill="#82c2ff" />
    </svg>
    {#if noThumb == true}
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19.5 45C19.5 59.0833 30.9167 70.5 45 70.5C59.0833 70.5 70.5 59.0833 70.5 45C70.5 30.9167 59.0833 19.5 45 19.5C30.9167 19.5 19.5 30.9167 19.5 45Z"
                stroke="#2B2B2B"
            />
            <path d="M44 35L37 41H34V49H36.9167L44 55V35Z" fill="#2B2B2B" />
            <path d="M48 41C50 44 50 46 48 49" stroke="#2B2B2B" />
            <path d="M51 39C54 42 54 48 51 51" stroke="#2B2B2B" />
            <path d="M54 37C58 42 58 48 54 53" stroke="#2B2B2B" />
        </svg>
    {:else}
        <img
            src="audio://{file.inode}"
            alt=""
            class="vcenter"
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
    img {
        width: 50rem;
        height: 50rem;
        border-radius: 25rem;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
    svg {
        position: absolute;
        left: 0rem;
        top: 0rem;
        z-index: 100;
        transition: opacity 0.2s ease-out;
    }
</style>
