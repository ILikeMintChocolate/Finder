<script>
    export let path
</script>

<div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video controls autoplay loop muted src="video://{path}" type="video/mp4" />
</div>

<style>
    div {
        height: 500rem;
        background-color: black;
    }
    video {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
