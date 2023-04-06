<script>
    import { settingModal, defaultPath } from '../state'
    let path
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main class="fc fcenter" on:click={() => ($settingModal = false)}>
    <section class="fc fleft hcenter" on:click={(event) => event.stopPropagation()}>
        <div class="setting-wrapper fc">
            <span class="section-title">Setting</span>
            <div class="fc" style="margin: 20rem 10rem 20rem 10rem; gap:10rem">
                <div class="fr fsbetween">
                    <span class="section-text">Default Path</span>
                    <button on:click={(event) => window.electron.setDefaultPath()}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.57633 7.54717H8.03431L7.8422 7.36192C8.51458 6.57976 8.91938 5.56432 8.91938 4.45969C8.91938 1.99657 6.92281 0 4.45969 0C1.99657 0 0 1.99657 0 4.45969C0 6.92281 1.99657 8.91938 4.45969 8.91938C5.56432 8.91938 6.57976 8.51458 7.36192 7.8422L7.54717 8.03431V8.57633L10.9777 12L12 10.9777L8.57633 7.54717ZM4.45969 7.54717C2.75129 7.54717 1.37221 6.1681 1.37221 4.45969C1.37221 2.75129 2.75129 1.37221 4.45969 1.37221C6.1681 1.37221 7.54717 2.75129 7.54717 4.45969C7.54717 6.1681 6.1681 7.54717 4.45969 7.54717Z"
                                fill="white"
                            />
                        </svg>
                    </button>
                </div>
                <span class="section-text" style="color: var(--lightwhite);">{$defaultPath}</span>
            </div>
        </div>
    </section>
</main>

<style>
    main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 10000;
    }
    section {
        width: 400rem;
        height: 600rem;
        background-color: var(--black);
        z-index: 10001;
    }
    .setting-wrapper {
        margin: 30rem 30rem 30rem 30rem;
    }
    .section-title {
        font-size: 14rem;
        font-weight: 500;
        color: var(--white);
    }
    .section-text {
        font-size: 14rem;
        font-weight: 400;
        color: var(--white);
    }
    button {
        width: 20rem;
        height: 20rem;
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: 0;
    }
    button:hover svg path {
        fill: var(--lightwhite);
    }
    button:focus {
        background-color: transparent;
    }
</style>
