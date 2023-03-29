<script>
    import { onMount } from 'svelte'
    import { currentPath, currentPathArray, currentPathIndex } from '../state.js'
    let isClick = false
    window.electron.receive('app:no-path', () => {
        document.getElementById('path-input').value = $currentPath
    })

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
    class="no-drag fr"
    on:click={() => {
        isClick = true
        document.getElementById('path-input').focus()
    }}
>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <input
        type="text"
        id="path-input"
        spellcheck="false"
        value={$currentPath}
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
            }
        }}
        on:blur={() => {
            isClick = false
        }}
    />
    <div id="path-button-wrapper" class="fr" style="display: {!isClick ? 'block' : 'none'};">
        {#each $currentPathArray as path, i}
            {#if $currentPathArray.length == i + 1}
                <button
                    on:click={(event) => {
                        if ($currentPath.length > 3) {
                            window.electron.setPath($currentPathArray.slice(0, i + 1).join('\\'))
                            window.electron.setPathHistory($currentPathArray.slice(0, i + 1).join('\\'))
                            $currentPathIndex += 1
                            event.stopPropagation()
                        }
                    }}
                    >{path} &gt;
                </button>
            {:else}
                <button
                    on:click={(event) => {
                        if ($currentPath.length > 3) {
                            window.electron.setPath($currentPathArray.slice(0, i + 1).join('\\'))
                            window.electron.setPathHistory($currentPathArray.slice(0, i + 1).join('\\'))
                            $currentPathIndex += 1
                            event.stopPropagation()
                        }
                    }}
                    >{path} &gt;
                </button>
            {/if}
        {/each}
    </div>
</section>

<style>
    section {
        position: relative;
        margin-left: 10rem;
        gap: 2rem;
        flex-grow: 1;
    }
    button {
        width: fit-content;
        height: 100%;
        font-size: 13rem;
        font-weight: 400;
        color: var(--font-lightgray);
        background-color: transparent;
        border: 0;
        border-radius: 0;
        cursor: pointer;
    }
    button:hover {
        color: var(--font-white);
    }
    button:active {
        background-color: transparent;
        color: var(--font-blue);
    }

    input {
        height: 40rem;
        width: fit-content;
        font-size: 13rem;
        border: 0;
        color: var(--font-lightgray);
        background-color: transparent;
    }
    input:focus {
        outline: 0;
    }
    input::selection {
        background-color: #1d1d1d;
    }

    #path-button-wrapper {
        width: fit-content;
        overflow: hidden;
    }
</style>
