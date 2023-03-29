<script>
    export let path, inode
</script>

<main class="fr fcenter no-drag">
    <img
        src="imagethumb://{inode},{path}"
        alt=""
        class="vcenter"
        on:load={function () {
            this.style.opacity = '1'
        }}
    />
</main>

<style>
    main {
        width: 90rem;
        height: 90rem;
    }
    img {
        width: 54rem;
        height: 70rem;
        object-fit: cover;
        border-radius: 4rem;
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
</style>
