<script>
    import Filter from './components/Search.svelte'
    import Folders from './components/Folders.svelte'
    import Header from './components/Header.svelte'
    import Tool from './components/Tool.svelte'
</script>

<head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&family=Roboto:wght@400;500&display=swap"
        rel="stylesheet"
    />
</head>

<main class="fr">
    <Filter />
    <div class="fc fg">
        <Header />
        <Tool />
        <Folders />
    </div>
</main>

<style>
</style>
