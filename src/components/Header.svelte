<script>
    import { currentPath } from '../state'

    let color1 = '#868686'
    let color2 = '#868686'
    let color3 = '#868686'
</script>

<main class="fr">
    <div id="drag-area">
        <div id="logo">Finder</div>
    </div>
    <button
        id="minimize-button"
        class="button-1"
        on:mouseenter={() => (color1 = '#ffffff')}
        on:mouseleave={() => (color1 = '#868686')}
        on:click={() => window.electron.minimizeWindow('aaa')}
    >
        <svg width="60" height="36" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="22" width="10" height="1" fill={color1} />
        </svg>
    </button>
    <button
        id="maximize-button"
        class="button-1"
        on:mouseenter={() => (color2 = '#ffffff')}
        on:mouseleave={() => (color2 = '#868686')}
        on:click={() => window.electron.maximizeWindow()}
        ><svg width="60" height="36" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25.5" y="15.5" width="7" height="7" stroke={color2} />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M28 14H34V20H33V21H34H35V20V14V13H34H28H27V14V15H28V14Z"
                fill={color2}
            />
        </svg>
    </button>
    <button
        id="close-button"
        class="button-2"
        on:mouseenter={() => (color3 = '#ffffff')}
        on:mouseleave={() => (color3 = '#868686')}
        on:click={() => window.electron.closeWindow()}
        ><svg width="60" height="36" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 13L35 23M35 13L25 23" stroke={color3} />
        </svg>
    </button>
</main>

<style>
    main {
        widows: 100vw;
        height: 36rem;
    }
    #drag-area {
        flex: 1;
        height: 100%;
        background-color: #1d1d1d;
        -webkit-app-region: drag;
    }
    #logo {
        font-size: 16rem;
        color: var(--font-white);
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-style: italic;
        line-height: 36rem;
        margin-left: 20rem;
    }
    button {
        width: 60rem;
        height: 36rem;
        border: 0;
        border-radius: 0;
        background-color: #1d1d1d;
    }
    .button-1:hover {
        background-color: #474747;
    }
    .button-2:hover {
        background-color: #ff3131;
    }
</style>
