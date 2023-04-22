<button id="pre-page-button" class="init-button" on:click={() => window.electron.prePage()}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5 15L18 19.5L22.5 24" stroke="#959595" />
    </svg>
</button>

<style>
    button svg path {
        stroke: #a9a8a8;
    }
    button:hover svg path {
        stroke: #7a7a7a;
    }
    button:disabled svg path {
        stroke: #a9a8a8;
    }
</style>
