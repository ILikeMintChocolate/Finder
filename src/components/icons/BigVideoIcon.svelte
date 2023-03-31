<script>
    export let path
</script>

<main class="fr">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video controls autoplay loop muted src="video://{path}" type="video/mp4" />
</main>

<style>
    main {
        position: relative;
        width: calc(100% - 40rem);
        background-color: #111111;
        overflow: hidden;
        margin: 40rem 20rem 20rem 20rem;
    }
    video {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
