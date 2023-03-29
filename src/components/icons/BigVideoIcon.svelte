<script>
    export let path
</script>

<main class="fr">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video id="aaa" controls autoplay loop src="video://{path}" />
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
