<script>
    import { onMount } from 'svelte'
    export let file
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

{#if noThumb == true}
    <svg class="vcenter" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11.5" stroke="#959595" />
        <path d="M6 10L11 7V17L6 14V10Z" fill="#959595" />
        <path d="M13 9C13.3333 9.83333 14 12 13 15M15 8C15.6667 9.16667 16.6 12.4 15 16" stroke="#959595" />
        <path d="M17 7C17.8333 8.5 19 12.6 17 17" stroke="#959595" />
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

<style>
    svg {
        margin: 0 12rem 0 12rem;
    }
    img {
        margin: 0 12rem 0 12rem;
        width: 24rem;
        height: 24rem;
        border-radius: 12rem;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
</style>
