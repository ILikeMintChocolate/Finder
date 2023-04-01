<script>
    let color1 = 'var(--ligthgray)'
    let color2 = 'var(--ligthgray)'
    let color3 = 'var(--ligthgray)'
</script>

<header class="fr">
    <div id="drag-area">
        <span id="logo" class="no-drag">Finder</span>
    </div>
    <button
        id="minimize-button"
        class="button-1"
        on:mouseenter={() => (color1 = 'var(--black')}
        on:mouseleave={() => (color1 = 'var(--ligthgray')}
        on:click={() => window.electron.minimizeWindow('aaa')}
    >
        <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="23" width="9" height="1" fill={color1} />
        </svg>
    </button>
    <button
        id="maximize-button"
        class="button-1"
        on:mouseenter={() => (color2 = 'var(--black')}
        on:mouseleave={() => (color2 = 'var(--ligthgray')}
        on:click={() => window.electron.maximizeWindow()}
        ><svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18.5" y="15.5" width="8" height="8" stroke={color2} />
        </svg>
    </button>
    <button
        id="close-button"
        class="button-2"
        on:mouseenter={() => (color3 = 'var(--red)')}
        on:mouseleave={() => (color3 = 'var(--ligthgray')}
        on:click={() => window.electron.closeWindow()}
        ><svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15L27 24M18 24L27 15" stroke={color3} />
        </svg>
    </button>
</header>

<style>
    header {
        height: 40rem;
        background-color: var(--white);
        box-sizing: border-box;
        border-bottom: 1rem solid #e2e2e2;
    }

    #drag-area {
        flex: 1;
        height: 100%;
        background-color: var(--white);
        -webkit-app-region: drag;
    }
    #logo {
        font-family: 'Roboto', 'Noto Sans KR', serif;
        font-size: 16rem;
        font-weight: 500;
        line-height: 40rem;
        margin-left: 16rem;
        color: var(--font-white);
    }
    button {
        width: 45rem;
        height: 40rem;
        border: 0;
        border-radius: 0;
        background-color: transparent;
    }
    button:focus {
        background-color: transparent;
    }
</style>
