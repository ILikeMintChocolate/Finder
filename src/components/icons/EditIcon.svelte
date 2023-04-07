<script>
    import { editMode } from '../../state'
</script>

<button
    on:click={() => {
        if ($editMode == true) window.electron.getFiles()
        $editMode = !$editMode
    }}
>
    {#if $editMode == false}
        <svg
            class="edit-icon"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0 10.292V13H2.70796L10.6946 5.01333L7.98667 2.30537L0 10.292ZM12.7888 2.91918C13.0704 2.63755 13.0704 2.18261 12.7888 1.90099L11.099 0.211221C10.8174 -0.0704069 10.3624 -0.0704069 10.0808 0.211221L8.75934 1.5327L11.4673 4.24066L12.7888 2.91918Z"
                fill="#CACACA"
            />
        </svg>
    {:else}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.13132 9.10067L1.04946 6.30201L0 7.24832L4.13132 11L13 2.94631L11.9579 2L4.13132 9.10067Z"
                fill="#FFCF23"
            />
        </svg>
    {/if}
</button>

<style>
    button {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 40rem;
        height: 40rem;
        border: 0;
        background-color: transparent;
    }

    button:hover .edit-icon path {
        fill: var(--white);
    }
</style>
