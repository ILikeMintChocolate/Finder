<script>
    import Filter from './renderer/components/Search.svelte'
    import Folders from './renderer/components/Folders.svelte'
    import Header from './renderer/components/Header.svelte'
    import Tool from './renderer/components/Tool.svelte'
    import { settingModal } from './renderer/state'
    import Setting from './renderer/components/Setting.svelte'
    import Ipc from './renderer/components/IPC.svelte'
    import { onMount } from 'svelte'
    import ContextMenu from './renderer/components/ContextMenu.svelte'

    onMount(async () => {
        window.electron.start()
    })
</script>

<head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
        rel="stylesheet"
    />
    <Ipc />
</head>

<main class="fr">
    <Filter />
    <div class="fc fg">
        <Header />
        <Tool />
        <Folders />
    </div>
    {#if $settingModal == true}
        <Setting />
    {/if}
    <ContextMenu />
</main>
