<script>
    import { currentPath } from '../../state'
    import { getParentPath } from '../../util'
</script>

<button
    id="parent-page-button"
    class="init-button"
    on:click={() => window.electron.newPage(getParentPath($currentPath.path))}
>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 19.5L20.5 15L25 19.5" />
        <rect x="20" y="15" width="1" height="9" />
    </svg>
</button>

<style>
    button svg path {
        stroke: #a9a8a8;
    }
    button svg rect {
        fill: #a9a8a8;
    }
    button:hover svg path {
        stroke: #7a7a7a;
    }
    button:hover svg rect {
        fill: #7a7a7a;
    }
    button:disabled svg path {
        stroke: #a9a8a8;
    }
    button:disabled svg rect {
        fill: #a9a8a8;
    }
</style>
