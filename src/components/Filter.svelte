<script>
    import { currentSelectedFile } from '../state.js'
    import BigImageIcon from './icons/BigImageIcon.svelte'
    import BigVideoIcon from './icons/BigVideoIcon.svelte'
    let resize = false
    let navWidth = 250
</script>

<nav style="width: {navWidth}rem;">
    <section>
        {#if $currentSelectedFile != null}
            {#if $currentSelectedFile.type == 'image'}
                <BigImageIcon name={$currentSelectedFile.name} />
            {:else if $currentSelectedFile.type == 'video'}
                <BigVideoIcon path={$currentSelectedFile.path} />
            {/if}
            <div class="file-info fr"><span class="file-name">{$currentSelectedFile.name}</span></div>
        {/if}
    </section>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div
        id="resize-area"
        on:mousedown={function () {
            resize = true
            this.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                background-color: transparent;
            `
        }}
        on:mouseup={function () {
            resize = false
            this.style.cssText = `
            position: absolute;
            top: 0;
            right: -10rem;
            width: 10rem;
            height: 100vh;
            z-index: 1000;
            cursor: ew-resize;
            background-color: transparent;
            `
        }}
        on:mousemove={(event) => {
            if (resize) {
                if (event.clientX <= 800) navWidth = event.clientX
            }
        }}
    />
</nav>

<style>
    nav {
        position: relative;
        height: calc(100vh);
        background-color: var(--black);
    }

    section {
        overflow-y: overlay;
        overflow-x: hidden;
        height: 100%;
    }

    section::-webkit-scrollbar {
        width: 6rem;
        background-color: transparent;
    }
    section::-webkit-scrollbar-thumb {
        width: 6rem;
        background-color: transparent;
    }
    section::-webkit-scrollbar-track {
        background: none;
    }
    section:hover::-webkit-scrollbar-thumb {
        background-color: #1d1d1d50;
    }

    .file-info {
        margin-top: 20rem;
    }

    .file-name {
        position: relative;
        width: 100%;
        font-size: 14rem;
        text-align: center;
        color: var(--white);
    }

    #resize-area {
        position: absolute;
        top: 0;
        right: -10rem;
        width: 10rem;
        height: 100vh;
        z-index: 1000;
        cursor: ew-resize;
        background-color: transparent;
    }
</style>
