<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    export let file, index
</script>

<img
    id="file-grid-media-{index}"
    src="imagethumb://{file.inode},{file.path}"
    alt=""
    on:load={function () {
        this.style.opacity = '1'
        dispatch('setLoadedCount')
    }}
/>

<style>
    img {
        position: relative;
        width: 120rem;
        height: auto;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
</style>
