<script>
    import { currentPath, pinned } from '../../state'
    import { edit } from '../../edit.js'
</script>

<button
    class="init-button"
    on:click={(event) => {
        event.stopPropagation()
        edit.finishEdit()
        window.electron.setPinned()
    }}
>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.5064 15.3337V15.3333C16.5064 14.8555 16.8749 14.5 17.2857 14.5H22.7143C23.1283 14.5 23.5 14.8588 23.5 15.3333V23.191L20.2236 21.5528L20 21.441L19.7764 21.5528L16.5006 23.1907L16.5064 15.3337Z"
            stroke="#959595"
            fill={$pinned.some((p) => p.ID == $currentPath?.id) ? '#959595' : 'transparent'}
        />
    </svg>
</button>

<style>
</style>
