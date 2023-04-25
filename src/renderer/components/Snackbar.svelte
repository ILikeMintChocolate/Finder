<script>
    import { onMount } from 'svelte'
    import { snackbars, copyFile } from '../state'
    export let message, time, type, index
    let snackbar, snackbarMessage
    const showSnackbar = () => {
        snackbarMessage.innerText = message
        if (type == 'copy-file') snackbar.classList.add('snackbar-never-destroy')
        else if (type == 'message') {
            snackbar.classList.add('snackbar-when-destroy')
            setTimeout(() => hideSnackbar(), time)
        }
    }
    const hideSnackbar = () => {
        try {
            $snackbars = $snackbars.filter((s) => s.index != index)
            snackbar.parentNode.removeChild(snackbar)
        } catch (error) {}
    }
    onMount(async () => showSnackbar())
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id={`snackbar-${index}`} bind:this={snackbar} class="fr">
    <span bind:this={snackbarMessage}>{message}</span>
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        on:click={() => {
            if (type == 'message') hideSnackbar()
            else if (type == 'copy-file') {
                $copyFile = null
                hideSnackbar()
            }
        }}
    >
        <path
            d="M13.4957 17.3117L10.888 14.824L10 15.6652L13.4957 19L21 11.8412L20.1182 11L13.4957 17.3117Z"
            fill="#FFCF23"
        />
    </svg>
</div>

<style>
    div {
        width: 140rem;
        height: 30rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: saturate(180%) blur(10rem);
        z-index: 100002;
    }

    span {
        flex: 1;
        line-height: 28rem;
        font-size: 13rem;
        font-weight: 400;
        color: white;
    }
</style>
