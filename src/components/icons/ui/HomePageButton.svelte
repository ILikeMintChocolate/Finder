<script>
    import { defaultPath, currentPathArray } from '../../../state'
</script>

<button class="init-button" on:click={() => window.electron.newPage($defaultPath)}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.8 24V20.4706H21.2V24H24.2V19.2941H26L20 14L14 19.2941H15.8V24H18.8Z" />
    </svg>
</button>

<style>
    button svg path {
        fill: #a9a8a8;
    }
    button:hover svg path {
        fill: #7a7a7a;
    }
    button:disabled svg path {
        fill: #a9a8a8;
    }
</style>
