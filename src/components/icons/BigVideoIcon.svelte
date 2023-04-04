<script>
    export let path
    console.log(path)
</script>

<main class="fr">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video controls autoplay loop muted src="video://{path}" type="video/mp4" />
</main>

<style>
    main {
        position: relative;
        width: 100%;
        background-color: #111111;
        overflow: hidden;
    }
    video {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
