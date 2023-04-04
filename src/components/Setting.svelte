<script>
    import { settingModal } from '../state'
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main class="fc fcenter" on:click={() => ($settingModal = false)}>
    <section class="hcenter" on:click={(event) => event.stopPropagation()} />
</main>

<style>
    main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 20000;
    }
    section {
        width: 400rem;
        height: 600rem;
        background-color: var(--black);
        z-index: 20001;
    }
</style>
