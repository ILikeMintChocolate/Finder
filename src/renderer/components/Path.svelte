<script>
    import { onMount } from 'svelte'
    import { currentPath, currentPathArray, stopKeyBoardEvent, startKeyBoardEvent, pinned } from '../state.js'
    import PinnedIcon from '../icons/ui/PinnedIcon.svelte'
    import { edit } from '../edit.js'
    let isClick = false

    onMount(async () => {
        let inputElement = document.getElementById('path-input')
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const oldValue = mutation.oldValue
                    const newValue = inputElement.getAttribute('style')
                    if (
                        oldValue &&
                        oldValue.indexOf('display: none') !== -1 &&
                        newValue.indexOf('display: block') !== -1
                    ) {
                        inputElement.dispatchEvent(new CustomEvent('displayChange'))
                    }
                }
            }
        })

        observer.observe(inputElement, { attributes: true, attributeOldValue: true })

        inputElement.addEventListener('displayChange', () => {
            inputElement.focus()
            inputElement.select()
        })
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<section
    class="no-drag fr fsbetween"
    on:click={() => {
        isClick = true
        document.getElementById('path-input').focus()
        stopKeyBoardEvent()
    }}
>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <input
        type="text"
        id="path-input"
        spellcheck="false"
        value={$currentPath?.path || ''}
        style="display: {isClick ? 'block' : 'none'};"
        on:keydown={function (event) {
            if (event.keyCode == 13) {
                let path = this.value[0].toUpperCase() + this.value.slice(1)
                if (path.length == 1) path += ':\\'
                else if (path.length == 2) path += '\\'
                else if (path[path.length - 1] == '\\') path = path.slice(0, path.length - 1)
                edit.finishEdit()
                window.electron.newPage(path)
                isClick = false
                startKeyBoardEvent()
            }
        }}
        on:blur={() => {
            isClick = false
        }}
    />
    <div id="path-button-wrapper" class="fr" style="display: {!isClick ? 'block' : 'none'};">
        {#each $currentPathArray as path, i}
            <button
                on:click={(event) => {
                    let newPath = `${$currentPathArray[0]}:\\${$currentPathArray.slice(1, i + 1).join('\\')}`
                    if (newPath.length) {
                        edit.finishEdit()
                        window.electron.newPage(newPath)
                        event.stopPropagation()
                    }
                }}
                style="color:{$currentPathArray.length == i + 1 ? 'var(--black)' : 'var(--gray)'};"
                class="path-button"
            >
                <span>{path}</span>
                {#if $currentPathArray.length != i + 1}
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L1 9" stroke="#787878" />
                    </svg>
                {/if}
            </button>
        {/each}
    </div>
    <button
        class="pinned-button"
        on:click={(event) => {
            event.stopPropagation()
            edit.finishEdit()
            window.electron.setPinned()
        }}
    >
        <PinnedIcon fill={$pinned.some((p) => p.ID == $currentPath.id) ? true : false} />
    </button>
</section>

<style>
    section {
        position: relative;
        flex-grow: 1;
        padding-left: 20rem;
        padding-top: 1rem;
    }
    .path-button {
        padding: 0;
        width: fit-content;
        height: 36rem;
        border: 0;
        cursor: pointer;
        background-color: transparent;
    }
    .path-button:active {
        background-color: transparent;
        color: var(--black);
    }
    .path-button:hover span {
        color: var(--black);
    }
    .path-button span {
        font-size: 14rem;
        font-weight: 400;
    }
    .path-button svg {
        margin-left: 10rem;
        margin-right: 10rem;
    }
    .pinned-button {
        border: 0;
        background-color: transparent;
    }

    input {
        margin-left: -5rem;
        position: relative;
        width: 100%;
        height: 36rem;
        font-size: 14rem;
        color: var(--black);
        border: 0;
        background-color: transparent;
    }
    input:focus {
        outline: 0;
    }

    #path-button-wrapper {
        width: fit-content;
        overflow: hidden;
    }
</style>
