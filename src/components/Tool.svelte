<script>
    import { currentPath, currentPathIndex, pathHistory } from '../state.js'
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
        ><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M27 19.125H16.3512L21.2425 14.2337L20 13L13 20L20 27L21.2337 25.7663L16.3512 20.875H27V19.125Z"
                fill={color1}
            />
        </svg>
    </button>
    <button
        id="parent-path-button"
        on:mouseenter={() => (color2 = '#7A7A7A')}
        on:mouseleave={() => (color2 = '#a9a8a8')}
        on:click={() => {
            if ($currentPath.length > 3) {
                window.electron.setPath($currentPath.slice(0, $currentPath.lastIndexOf('\\')))
                window.electron.setPathHistory($currentPath.slice(0, $currentPath.lastIndexOf('\\')))
                $currentPathIndex += 1
            }
        }}
        ><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20.875 27L20.875 16.3512L25.7663 21.2425L27 20L20 13L13 20L14.2337 21.2337L19.125 16.3512L19.125 27H20.875Z"
                fill={color2}
            />
        </svg>
    </button>
    <Path />
</main>

<style>
    main {
        height: 40rem;
        background-color: #3a3a3a;
    }
    button {
        border: 0;
        background-color: transparent;
    }
    button:active {
        background-color: #dfdfdf;
    }
    button:disabled {
        background-color: transparent;
    }
</style>
