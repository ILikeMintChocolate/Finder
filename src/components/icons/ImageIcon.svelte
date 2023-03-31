<script>
    import { createEventDispatcher } from 'svelte'
    import { currentSelectedFile } from '../../state'
    const dispatch = createEventDispatcher()
    export let file, index
    let mouseover = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    class="file-info-wrapper"
    on:click={function (event) {
        this.focus()
        $currentSelectedFile = file
        event.stopPropagation()
    }}
    on:mouseover={() => (mouseover = true)}
    on:mouseleave={() => (mouseover = false)}
>
    <img
        id="file-grid-media-{index}"
        src="imagethumb://{file.inode},{file.path}"
        alt=""
        tabindex="0"
        style="filter: {mouseover ? 'brightness(50%)' : 'none'}"
        on:load={function () {
            this.style.opacity = '1'
            dispatch('setLoadedCount')
        }}
    />
    {#if mouseover == true || $currentSelectedFile?.name == file.name}
        <div class="file-info" on:mouseover={() => (mouseover = true)}>
            {file.name}
        </div>
    {/if}
</div>

<style>
    img {
        position: relative;
        width: 150rem;
        height: auto;
        object-fit: cover;
        opacity: 0;
        transition: filter 0.15s ease-out;
    }
    img:focus {
        filter: brightness(50%) !important;
    }

    .file-info {
        position: absolute;
        font-size: 14rem;
        color: var(--white);
        width: calc(100% - 20rem);
        margin: 0 10rem 0 10rem;
        word-break: break-all;
        bottom: 20rem;
        font-family: 'Roboto', 'Noto Sans KR', sans-serif;
        z-index: 100;
        font-weight: 400;
    }
</style>
