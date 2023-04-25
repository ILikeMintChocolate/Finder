<script>
    import HomePageButton from '../icons/ui/HomePageButton.svelte'
    import PrePageButton from '../icons/ui/PrePageButton.svelte'
    import NextPageButton from '../icons/ui/NextPageButton.svelte'
    import ParentPageButton from '../icons/ui/ParentPageButton.svelte'
    import { currentPath, nextPageStack, prePageStack } from '../state'
    import { getParentPath } from '../util'
    import Path from './Path.svelte'
    import RefreshIcon from '../icons/ui/RefreshIcon.svelte'

    window.electron.receive('app:set-tool-button', () => {
        $prePageStack.length
            ? document.getElementById('pre-page-button').removeAttribute('disabled')
            : document.getElementById('pre-page-button').setAttribute('disabled', '')
        $nextPageStack.length
            ? document.getElementById('next-page-button').removeAttribute('disabled')
            : document.getElementById('next-page-button').setAttribute('disabled', '')
        getParentPath($currentPath.path) != false
            ? document.getElementById('parent-page-button').removeAttribute('disabled')
            : document.getElementById('parent-page-button').setAttribute('disabled', '')
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main class="fr">
    <HomePageButton />
    <PrePageButton />
    <NextPageButton />
    <ParentPageButton />
    <RefreshIcon />
    <Path />
</main>

<style>
    main {
        height: 40rem;
        background-color: var(--white);
        padding: 0 14rem 0 14rem;
    }
</style>
