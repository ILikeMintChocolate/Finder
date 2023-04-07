<script>
    import {
        currentPathIndex,
        currentSelectedFile,
        pathHistory,
        pinned,
        extensionList,
        searchOption,
        metadata,
        editMode,
        tagList,
    } from '../state.js'
    import BigImageIcon from './icons/BigImageIcon.svelte'
    import BigVideoIcon from './icons/BigVideoIcon.svelte'
    import EditIcon from './icons/EditIcon.svelte'
    import PinnedIcon from './icons/ui/PinnedIcon.svelte'
    import SettingIcon from './icons/ui/SettingIcon.svelte'
    import RateIcon from './icons/ui/RateIcon.svelte'
    import SearchRateIcon from './icons/ui/SearchRateIcon.svelte'
    $: $currentSelectedFile && refresh()

    const refresh = () => {
        if ($editMode == true) {
            window.electron.getFiles()
            $editMode == false
        }
    }

    let resize = false
    let navWidth = 250
</script>

<nav style="width: {navWidth}rem;">
    <section class="fc fleft no-drag">
        {#if $currentSelectedFile == null || $currentSelectedFile.type.split('/')[0] == 'folder'}
            <div id="search-wrapper" class="fc">
                <div class="search-section-wrapper fc">
                    <span class="search-title fr">
                        Pinned&nbsp;&nbsp;
                        <PinnedIcon border={2} color={'#959595'} />
                    </span>
                    <div class="search-item-grid fr">
                        {#each $pinned as pin}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <span
                                class="search-item"
                                on:click={() => {
                                    if (pin.path.length == 2) {
                                        pin.path += '\\'
                                    }
                                    window.electron.setPath(pin.path)
                                    window.electron.setPathHistory(pin.path)
                                    $currentPathIndex += 1
                                    $pathHistory = $pathHistory.slice(0, $currentPathIndex)
                                }}>{pin.title}</span
                            >
                        {/each}
                    </div>
                </div>
                <div class="search-section-wrapper fc">
                    <span class="search-title fr">Type</span>
                    <div class="search-item-grid fr">
                        {#each $extensionList as ext}
                            <input type="checkbox" id={ext} bind:group={$searchOption.ext} value={ext} />
                            <label class="search-item" for={ext} style="text-transform: capitalize;">{ext}</label>
                        {/each}
                    </div>
                </div>
                <div class="search-section-wrapper fc">
                    <span class="search-title fr">Tag</span>
                    <div class="search-item-grid fr">
                        {#each $tagList as tag}
                            <input type="checkbox" id={tag} bind:group={$searchOption.tag} value={tag} />
                            <label class="search-item" for={tag} style="text-transform: capitalize;"># {tag}</label>
                        {/each}
                    </div>
                </div>
                <div class="search-section-wrapper fc">
                    <span class="search-title fr">Rate</span>
                    <SearchRateIcon />
                </div>
            </div>
            <SettingIcon />
        {:else}
            {#if $currentSelectedFile.type.split('/')[0] == 'image'}
                <BigImageIcon path={$currentSelectedFile.path} />
            {:else if $currentSelectedFile.type.split('/')[0] == 'video'}
                <BigVideoIcon path={$currentSelectedFile.path} />
            {/if}
            <div class="info-wrapper fc no-drag">
                <span class="file-info-text">{$currentSelectedFile.name}</span>
                {#if $currentSelectedFile.type.split('/')[0] != 'folder'}
                    <span class="file-info-text" style="color: var(--ligthgray)">{$currentSelectedFile.size}</span>
                    <span class="file-info-text" style="color: var(--ligthgray)">{$currentSelectedFile.tag}</span>
                {/if}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <RateIcon />
            </div>
            <EditIcon />
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
        on:mouseleave={function () {
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
        width: 4rem;
        background-color: transparent;
    }
    section::-webkit-scrollbar-thumb {
        width: 4rem;
        background-color: transparent;
    }
    section::-webkit-scrollbar-track {
        background: none;
    }
    section:hover::-webkit-scrollbar-thumb {
        background-color: var(--gray);
    }

    .info-wrapper {
        position: relative;
        margin: 30rem 35rem 40rem 35rem;
        gap: 20rem;
    }

    .file-info-text {
        position: relative;
        width: 100%;
        font-size: 14rem;
        color: var(--white);
        word-wrap: break-word;
        line-height: 30rem;
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

    #search-wrapper {
        margin: 40rem 35rem 40rem 35rem;
        gap: 50rem;
    }

    .search-section-wrapper {
        gap: 16rem;
    }

    .search-item-grid {
        gap: 16rem;
        flex-wrap: wrap;
    }

    .search-title {
        font-size: 14rem;
        font-weight: 500;
        color: var(--white);
    }

    .search-item {
        font-size: 13rem;
        font-weight: 300;
        color: var(--lightwhite);
        cursor: pointer;
        margin: 0;
        padding: 0;
    }

    input[type='checkbox'] {
        display: none;
    }

    input[type='checkbox']:checked + label {
        color: var(--yellow);
    }
</style>
