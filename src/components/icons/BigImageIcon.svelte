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
        width: 100%;
        background-color: #111111;
        overflow: hidden;
    }
    img {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
