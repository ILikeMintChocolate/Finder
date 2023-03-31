<script>
    import { currentPath } from '../../state.js'
    export let name
</script>

<main id="big-image-wrapper" class="fr fcenter no-drag">
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <img id="big-image" src="image://{$currentPath}\{name}" alt="" />
</main>

<style>
    main {
        position: relative;
        width: calc(100% - 40rem);
        background-color: #111111;
        overflow: hidden;
        margin: 40rem 20rem 20rem 20rem;
    }
    img {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
