<script>
    import { createEventDispatcher } from 'svelte'
    import { currentSelectedFile } from '../../../state'
    const dispatch = createEventDispatcher()
    export let file
    let mouseover = false
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    id="file-{file.inode}"
    class="file fc"
    tabindex="0"
    on:click={(event) => {
        $currentSelectedFile = file
        event.stopPropagation()
    }}
    on:dblclick={() => {
        window.electron.openFile(file.path)
    }}
    on:focus={() => {
        $currentSelectedFile = file
    }}
    on:mouseover={() => (mouseover = true)}
    on:mouseleave={() => (mouseover = false)}
    draggable="true"
>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <img
        id="file-grid-media-{file.inode}"
        src="imagethumb://{file.inode},{file.path},{file.type}"
        alt=""
        class="vcenter"
        on:load={function () {
            this.style.opacity = '1'
            if (this.clientWidth > this.clientHeight) {
                this.parentElement.style.gridColumn = 'span 2'
            }
        }}
    />
    {#if mouseover == true || $currentSelectedFile?.name == file.name}
        <div class="file-info" on:mouseover={() => (mouseover = true)}>
            {file.name}
        </div>
    {/if}
</div>

<style>
    .file {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .file:focus {
        outline: 0;
    }

    .file:hover img {
        filter: brightness(50%);
    }

    .file:focus img {
        filter: brightness(50%) !important;
    }

    img {
        position: relative;
        width: 100%;
        height: auto;
        object-fit: cover;
        opacity: 0;
        transition: filter 0.1s ease-out;
    }

    .file-info {
        position: absolute;
        font-size: 12rem;
        color: var(--white);
        width: calc(100% - 20rem);
        margin: 0 10rem 0 10rem;
        word-break: break-all;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
        font-weight: 400;
    }
</style>
