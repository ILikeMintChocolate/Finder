<script>
    import { snackbars } from '../state'
    import Snackbar from './Snackbar.svelte'
</script>

<div id="snack" class="fc">
    {#each $snackbars as s}
        <Snackbar message={s.message} time={s.time} type={s.type} index={s.index} />
    {/each}
</div>

<style>
    div {
        position: absolute;
        width: 100rem;
        height: fit-content;
        left: 50%;
        bottom: 50rem;
        transform: translateX(-50%);
        z-index: 100001;
    }
</style>
