<script context="module">
    let snackbar, snackbarMessage
    export const showSnackbar = (msg = '') => {
        if (!snackbar.classList.contains('show-snackbar')) {
            snackbar.classList.add('show-snackbar')
            snackbarMessage.innerText = msg
            setTimeout(() => hideSnackbar(), 3000)
        }
    }
    export const hideSnackbar = () => {
        snackbar.classList.remove('show-snackbar')
        snackbarMessage.innerText = ''
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="snackbar-wrapper" bind:this={snackbar} class="fr">
    <span bind:this={snackbarMessage} />
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        on:click={() => hideSnackbar()}
    >
        <path
            d="M13.4957 17.3117L10.888 14.824L10 15.6652L13.4957 19L21 11.8412L20.1182 11L13.4957 17.3117Z"
            fill="#FFCF23"
        />
    </svg>
</div>

<style>
    #snackbar-wrapper {
        position: absolute;
        width: 140rem;
        height: 30rem;
        bottom: 40rem;
        left: 50%;
        text-align: center;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: saturate(180%) blur(10rem);
        visibility: hidden;
        z-index: 100001;
    }

    span {
        flex: 1;
        line-height: 30rem;
        font-size: 13rem;
        font-weight: 400;
        color: white;
    }
</style>
