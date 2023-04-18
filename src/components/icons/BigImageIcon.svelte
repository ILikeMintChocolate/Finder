<script>
    export let path
</script>

<div>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <img src="image://{path}" alt="" />
</div>

<style>
    div {
        height: 500rem;
        background-color: black;
    }
    img {
        position: relative;
        top: 0rem;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
