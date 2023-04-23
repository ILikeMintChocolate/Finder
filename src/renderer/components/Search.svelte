<script>
    import {
        currentSelectedFile,
        pinned,
        extensionList,
        searchOption,
        editMode,
        tagList,
        startKeyBoardEvent,
        stopKeyBoardEvent,
    } from '../state.js'
    import BigImageIcon from '../icons/ui/BigImageIcon.svelte'
    import BigVideoIcon from '../icons/ui/BigVideoIcon.svelte'
    import EditIcon from '../icons/ui/EditIcon.svelte'
    import SettingIcon from '../icons/ui/SettingIcon.svelte'
    import RateIcon from '../icons/ui/RateIcon.svelte'
    import SearchRateIcon from '../icons/ui/SearchRateIcon.svelte'
    $: $currentSelectedFile, refresh()
    $: $editMode, setKeyboardEvent()
    const file = {
        id: null,
        rate: null,
        tag: null,
    }
    const resetFile = () => {
        file.id = null
        file.rate = null
        file.tag = null
    }
    const refresh = () => {
        if ($editMode == true) {
            $editMode == false
            resetFile()
        }
    }

    const setKeyboardEvent = () => {
        if ($editMode == true) {
            file.id = $currentSelectedFile.id
            file.rate = $currentSelectedFile.rate
            file.tag = $currentSelectedFile.tag.join(',')
            stopKeyBoardEvent()
        } else {
            if (file.id != null) {
                let option = []
                if (file.rate != (document.getElementById('set-rate-wrapper').dataset.rate || 0)) {
                    option.push(['rate', document.getElementById('set-rate-wrapper').dataset.rate])
                }
                if (file.tag != document.getElementById('edit-tag-input').value) {
                    option.push([
                        'tag',
                        document
                            .getElementById('edit-tag-input')
                            .value.split(',')
                            .filter((t) => t != ''),
                    ])
                }
                if (option.length)
                    window.electron.setMetadata({
                        id: file.id,
                        option: option,
                    })
                resetFile()
            }
            startKeyBoardEvent()
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
                    <span class="search-title fr"> Pinned </span>
                    <div class="search-item-grid fr">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        {#each $pinned as pin}
                            <span
                                class="search-item"
                                on:click={() => {
                                    if (pin.PATH.length == 2) {
                                        pin.PATH += '\\'
                                    }
                                    window.electron.newPage(pin.PATH)
                                }}>{pin.TITLE}</span
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
            <div id="search-edit-button-wrapper" class="fr fsbetween">
                <button on:click={() => window.electron.getAllChildFiles()}>Find All Files</button>
                <SettingIcon />
            </div>
        {:else}
            <div id="info-wrapper" class="fc">
                {#if $currentSelectedFile.type.split('/')[0] == 'image'}
                    <BigImageIcon path={$currentSelectedFile.path} />
                {:else if $currentSelectedFile.type.split('/')[0] == 'video'}
                    <BigVideoIcon path={$currentSelectedFile.path} />
                {/if}
                <div class="info-detail-wrapper fc no-drag">
                    <span class="file-info-text">{$currentSelectedFile.name}</span>
                    {#if $currentSelectedFile.type.split('/')[0] != 'folder'}
                        <span class="file-info-text" style="color: var(--ligthgray)">{$currentSelectedFile.size}</span>
                        {#if $currentSelectedFile.tag.length != 0}
                            <div class="tag-wrapper fr">
                                {#each $currentSelectedFile.tag as tag}
                                    <div class="tag-item"># {tag}</div>
                                {/each}
                            </div>
                        {/if}
                    {/if}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    {#if $editMode == true}
                        <textarea
                            id="edit-tag-input"
                            placeholder="태크를 추가해보세요 (ex: 고해상도,풍경,사과)"
                            value={$currentSelectedFile.tag}
                        />
                    {/if}
                    <RateIcon rate={$currentSelectedFile.rate} />
                </div>
                <EditIcon />
            </div>
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

    #info-wrapper {
        position: relative;
    }

    .info-detail-wrapper {
        height: max-content;
        position: relative;
        margin: 30rem 35rem 40rem 35rem;
        gap: 30rem;
    }

    .file-info-text {
        position: relative;
        width: 100%;
        font-size: 13rem;
        color: var(--white);
        word-wrap: break-word;
        line-height: 16rem;
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
        display: grid;
        margin: 40rem 35rem 40rem 35rem;
        row-gap: 50rem;
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
        line-height: 16rem;
    }

    input[type='checkbox'] {
        display: none;
    }

    input[type='checkbox']:checked + label {
        color: var(--yellow);
    }

    #edit-tag-input {
        width: 100%;
        height: 60rem;
        border: 1rem solid #5c5c5c;
        background-color: transparent;
        font-size: 13rem;
        color: var(--white);
        resize: vertical;
    }
    #edit-tag-input:focus {
        outline: 0;
    }

    .tag-wrapper {
        flex-wrap: wrap;

        width: 100%;
        gap: 16rem;
    }
    .tag-item {
        line-height: 16rem;
        font-size: 13rem;
        font-weight: 300;
        color: var(--lightwhite);
    }

    #search-edit-button-wrapper {
        position: absolute;
        bottom: 0rem;
        left: 0rem;
        width: 100%;
        height: 40rem;
    }
    #search-edit-button-wrapper button {
        position: relative;
        width: 100%;
        height: 100%;
        font-size: 14rem;
        border: 0;
        background-color: transparent;
        color: var(--white);
        font-weight: 500;
        text-align: left;
        margin-left: 30rem;
    }
    #search-edit-button-wrapper button:hover {
        color: var(--yellow);
    }
</style>
