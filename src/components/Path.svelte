<script>
    import { onMount } from 'svelte'
    import {
        currentPath,
        currentPathArray,
        currentPathIndex,
        stopKeyBoardEvent,
        startKeyBoardEvent,
        pinned,
    } from '../state.js'
    import PinnedIcon from './icons/ui/PinnedIcon.svelte'
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
        value={$currentPath.path}
        style="display: {isClick ? 'block' : 'none'};"
        on:keydown={function (event) {
            if (event.keyCode == 13) {
                let path = this.value[0].toUpperCase() + this.value.slice(1)
                if (path.length == 2) {
                    path += '\\'
                } else if (path[path.length - 1] == '\\') {
                    path = path.slice(0, path.length - 1)
                }
                window.electron.setPath(path)
                window.electron.setPathHistory(path)
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
                    if ($currentPath.path.length > 3) {
                        window.electron.setPath($currentPathArray.slice(0, i + 1).join('\\'))
                        window.electron.setPathHistory($currentPathArray.slice(0, i + 1).join('\\'))
                        $currentPathIndex += 1
                        event.stopPropagation()
                    }
                }}
                style="color:{$currentPathArray.length == i + 1 ? 'var(--black)' : 'var(--gray)'};"
                class="path-button"
            >
                {#if $currentPathArray.length == i + 1}
                    <span>{path}</span>
                {:else}
                    {#if i == 0}
                        <span>{path.replace(':', '')}</span>
                    {:else}
                        <span>{path}</span>
                    {/if}
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
            let breakBool = false
            for (let i = 0; i < $pinned.length; i++) {
                if ($pinned[i].inode == $currentPath.inode) {
                    window.electron.setPinned(false)
                    breakBool = true
                    break
                }
            }
            if (breakBool == false) window.electron.setPinned(true)
        }}
    >
        <PinnedIcon border={1} color={$pinned.some((e) => e.inode == $currentPath.inode) ? '#237BFF' : '#959595'} />
    </button>
</section>

<style>
    section {
        position: relative;
        flex-grow: 1;
        padding-left: 10rem;
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
        height: 36rem;
        width: fit-content;
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
