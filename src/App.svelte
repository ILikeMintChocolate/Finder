<script>
    import Filter from './components/Filter.svelte'
    import Folders from './components/Folders.svelte'
    import Header from './components/Header.svelte'
    import Tool from './components/Tool.svelte'
</script>

<head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Poppins:ital,wght@0,400;0,500;0,600;1,500;1,600&display=swap"
        rel="stylesheet"
    />
</head>

<main class="fc">
    <Header />
    <div class="fr">
        <Filter />
        <div class="fc" style="flex-grow: 1;">
            <Tool />
            <Folders />
        </div>
    </div>
</main>

<style>
    main {
        overflow: hidden;
    }
</style>
