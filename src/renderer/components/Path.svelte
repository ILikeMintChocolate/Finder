<script>
    import { onMount } from 'svelte'
    import { currentPath, currentPathArray, stopKeyBoardEvent, startKeyBoardEvent, pinned } from '../state.js'
    import PinnedIcon from '../icons/ui/PinnedIcon.svelte'
    import { edit } from '../edit.js'
    let scroll = false,
        scrolling = false,
        startX = 0,
        scrollLeft = 0,
        typingPath = false
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
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<section
    class="no-drag fr fsbetween"
    on:mouseup={() => {
        if (scrolling == false) {
            typingPath = true
            document.getElementById('path-input').focus()
            stopKeyBoardEvent()
            scroll = false
            scrolling = false
        }
    }}
>
    <input
        type="text"
        id="path-input"
        spellcheck="false"
        value={$currentPath?.path || ''}
        style="display: {typingPath ? 'block' : 'none'};"
        on:keydown={function (event) {
            if (event.keyCode == 13) {
                let path = this.value[0].toUpperCase() + this.value.slice(1)
                if (path.length == 1) path += ':\\'
                else if (path.length == 2) path += '\\'
                else if (path[path.length - 1] == '\\') path = path.slice(0, path.length - 1)
                edit.finishEdit()
                window.electron.newPage(path)
                typingPath = false
                startKeyBoardEvent()
            }
        }}
        on:blur={() => {
            typingPath = false
        }}
    />
    <div
        id="path-button-wrapper"
        class="fr fg"
        style="display: {!typingPath ? 'grid' : 'none'};"
        on:mousedown={function (event) {
            scroll = true
            startX = event.pageX - this.offsetLeft
            scrollLeft = this.scrollLeft
        }}
        on:mousemove={function (event) {
            if (scroll) {
                const x = event.pageX - this.offsetLeft
                const s = x - startX
                this.scrollLeft = scrollLeft - s
                scrolling = true
            }
        }}
        on:mouseup={() => {
            if (!scrolling) {
                typingPath = true
            }
        }}
    >
        {#each $currentPathArray as path, i}
            <button
                on:mouseup={(event) => {
                    if (scroll && !scrolling) {
                        let newPath = `${$currentPathArray[0]}:\\${$currentPathArray.slice(1, i + 1).join('\\')}`
                        if (newPath.length) {
                            edit.finishEdit()
                            window.electron.newPage(newPath)
                        }
                    }
                    scroll = false
                    scrolling = false
                    event.stopPropagation()
                    event.preventDefault()
                }}
                on:mouseleave={() => {
                    scroll = false
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
</section>

<style>
    section {
        position: relative;
        flex: 1;
        padding: 1rem 50rem 0 20rem;
    }
    .path-button {
        padding: 0;
        width: max-content;
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

    #path-button-wrapper {
        width: 0rem;
        display: grid;
        grid-auto-rows: 1fr;
        grid-auto-flow: column;
        justify-content: start;
        overflow-x: scroll;
        overflow-y: hidden;
        margin-right: 50rem;
    }
    #path-button-wrapper::-webkit-scrollbar {
        height: 1px;
    }
    #path-button-wrapper::-webkit-scrollbar-thumb {
        background: transparent;
    }
    #path-button-wrapper:hover::-webkit-scrollbar-thumb {
        background: black;
    }
</style>
