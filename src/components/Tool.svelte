<script>
    import { currentPath, currentPathIndex, pathHistory } from '../state.js'
    import BackButtonIcon from './icons/BackButtonIcon.svelte'
    import FowardButtonIcon from './icons/FowardButtonIcon.svelte'
    import ParentButtonIcon from './icons/ParentButtonIcon.svelte'
    import Path from './Path.svelte'
    let color1 = '#a9a8a8'
    let color2 = '#a9a8a8'

    window.electron.receive('app:set-tool-button', (arg) => {
        if ($currentPathIndex != 1) {
            document.getElementById('back-path-button').removeAttribute('disabled')
        } else {
            color1 = '#a9a8a8'
            document.getElementById('back-path-button').setAttribute('disabled', '')
        }
        if (arg.length > 3) {
            document.getElementById('parent-path-button').removeAttribute('disabled')
        } else {
            color2 = '#a9a8a8'
            document.getElementById('parent-path-button').setAttribute('disabled', '')
        }
    })
</script>

<main class="fr">
    <button
        id="back-path-button"
        on:mouseenter={() => (color1 = '#7A7A7A')}
        on:mouseleave={() => (color1 = '#a9a8a8')}
        on:click={() => {
            $currentPathIndex -= 1
            if ($pathHistory.length != 0) {
                window.electron.setPath($pathHistory[$currentPathIndex - 1])
            }
        }}
        ><BackButtonIcon />
    </button>
    <button
        on:mouseenter={() => (color1 = '#7A7A7A')}
        on:mouseleave={() => (color1 = '#a9a8a8')}
        on:click={() => {
            $currentPathIndex -= 1
            if ($pathHistory.length != 0) {
                window.electron.setPath($pathHistory[$currentPathIndex - 1])
            }
        }}
        ><FowardButtonIcon />
    </button>
    <button
        id="parent-path-button"
        on:mouseenter={() => (color2 = '#7A7A7A')}
        on:mouseleave={() => (color2 = '#a9a8a8')}
        on:click={() => {
            if ($currentPath.path.length > 3) {
                window.electron.setPath($currentPath.path.slice(0, $currentPath.path.lastIndexOf('\\')))
                window.electron.setPathHistory($currentPath.path.slice(0, $currentPath.path.lastIndexOf('\\')))
                $currentPathIndex += 1
            }
        }}
        ><ParentButtonIcon />
    </button>
    <Path />
</main>

<style>
    main {
        height: 40rem;
        background-color: var(--white);
    }
    button {
        border: 0;
        background-color: transparent;
    }
    button:active {
        background-color: transparent;
    }
    button:disabled {
        background-color: transparent;
    }

    #back-path-button {
        margin-left: 12rem;
    }
</style>
