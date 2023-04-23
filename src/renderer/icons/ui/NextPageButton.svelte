<button id="next-page-button" class="init-button" on:click={() => window.electron.nextPage()}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.5 24L23 19.5L18.5 15" stroke="#959595" />
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
