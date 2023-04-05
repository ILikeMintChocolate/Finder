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
    } from '../state.js'
    import BigImageIcon from './icons/BigImageIcon.svelte'
    import BigVideoIcon from './icons/BigVideoIcon.svelte'
    import EditIcon from './icons/EditIcon.svelte'
    import PinnedIcon from './icons/PinnedIcon.svelte'
    import SettingIcon from './icons/SettingIcon.svelte'
    import StarIcon from './icons/ui/StarIcon.svelte'
    $: $currentSelectedFile && ($editMode = false)

    let currentRate = 0,
        mouseoverRate = 0,
        mouseover = false
    let resize = false
    let navWidth = 250
</script>

<nav style="width: {navWidth}rem;">
    <section class="fc fleft no-drag">
        {#if $currentSelectedFile == null}
            <div id="search-wrapper" class="fc">
                {#if $pinned.length != 0}
                    <div class="search-section-wrapper fc">
                        <span class="search-title fr"
                            >Pinned&nbsp;&nbsp;<PinnedIcon border={2} color={'#959595'} /></span
                        >
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
                {/if}
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
                    <span class="search-title fr">Rate</span>
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
                {/if}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <div
                    class="rate-star-wrapper fr"
                    on:click={(event) => {
                        if ($editMode == true) {
                            if (event.layerX < 0) {
                                currentRate = 0
                            } else if (event.layerX < 7) {
                                currentRate = 0.5
                            } else if (event.layerX < 16) {
                                currentRate = 1
                            } else if (event.layerX < 26) {
                                currentRate = 1.5
                            } else if (event.layerX < 35) {
                                currentRate = 2
                            } else if (event.layerX < 45) {
                                currentRate = 2.5
                            } else if (event.layerX < 54) {
                                currentRate = 3
                            } else if (event.layerX < 64) {
                                currentRate = 3.5
                            } else if (event.layerX < 73) {
                                currentRate = 4
                            } else if (event.layerX < 83) {
                                currentRate = 4.5
                            } else {
                                currentRate = 5
                            }
                            if ($metadata[$currentSelectedFile.hash] == undefined) {
                                $metadata[$currentSelectedFile.hash] = {
                                    rate: currentRate,
                                    tag: [],
                                }
                            } else {
                                $metadata[$currentSelectedFile.hash].rate = currentRate
                            }
                            window.electron.saveMetadata($metadata)
                        }
                    }}
                    on:mouseover={() => (mouseover = true)}
                    on:mouseleave={() => (mouseover = false)}
                    on:mousemove={(event) => {
                        if (mouseover && $editMode) {
                            if (event.layerX < 0) {
                                mouseoverRate = 0
                            } else if (event.layerX < 7) {
                                mouseoverRate = 0.5
                            } else if (event.layerX < 16) {
                                mouseoverRate = 1
                            } else if (event.layerX < 26) {
                                mouseoverRate = 1.5
                            } else if (event.layerX < 35) {
                                mouseoverRate = 2
                            } else if (event.layerX < 45) {
                                mouseoverRate = 2.5
                            } else if (event.layerX < 54) {
                                mouseoverRate = 3
                            } else if (event.layerX < 64) {
                                mouseoverRate = 3.5
                            } else if (event.layerX < 73) {
                                mouseoverRate = 4
                            } else if (event.layerX < 83) {
                                mouseoverRate = 4.5
                            } else {
                                mouseoverRate = 5
                            }
                        }
                    }}
                >
                    <StarIcon {mouseover} {mouseoverRate} />
                </div>
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
        font-size: 14rem;
        font-weight: 400;
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

    .rate-star-wrapper {
        gap: 4rem;
        width: fit-content;
        margin-left: -20rem;
        padding: 2rem 20rem 2rem 20rem;
    }
</style>
