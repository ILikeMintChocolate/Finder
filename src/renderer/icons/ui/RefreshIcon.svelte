<script>
    import { edit } from '../../edit'
</script>

<button
    class="init-button"
    on:click={() => {
        edit.finishEdit()
        window.electron.refresh()
    }}
>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M23.6773 16.3219C22.8612 15.5062 21.7411 15 20.4972 15C18.0094 15 16 17.0137 16 19.5C16 21.9863 18.0094 24 20.4972 24C22.5966 24 24.3471 22.5656 24.848 20.625H23.6773C23.2158 21.9356 21.9662 22.875 20.4972 22.875C18.6341 22.875 17.1201 21.3619 17.1201 19.5C17.1201 17.6381 18.6341 16.125 20.4972 16.125C21.4315 16.125 22.2645 16.5131 22.8724 17.1263L21.06 18.9375H25V15L23.6773 16.3219Z"
            fill="#959595"
        />
    </svg>
</button>

<style>
    button svg path {
        fill: #a9a8a8;
    }
    button:hover svg path {
        fill: #7a7a7a;
    }
</style>
