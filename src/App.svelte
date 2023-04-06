<script>
    import Filter from './components/Search.svelte'
    import Folders from './components/Folders.svelte'
    import Header from './components/Header.svelte'
    import Tool from './components/Tool.svelte'
    import { settingModal } from './state'
    import Setting from './components/Setting.svelte'
    import Ipc from './components/IPC.svelte'
</script>

<head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
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
</main>

<Ipc />

<style>
</style>
