<script>
    export let border
    export let color
</script>

{#if border == 2}
    <div>
        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.71429 0H1.28571C0.578571 0 0.00642872 0.6 0.00642872 1.33333L0 12L4.5 10L9 12V1.33333C9 0.6 8.42143 0 7.71429 0ZM7 9L4.5 8L2 9V2H7V9Z"
                fill="white"
            />
        </svg>
    </div>
{:else if border == 1}
    <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="margin: 0 12rem 0 12rem;"
    >
        <rect width="40" height="40" fill="white" />
        <path
            d="M23.7143 14H17.2857C16.5786 14 16.0064 14.6 16.0064 15.3333L16 26L20.5 24L25 26V15.3333C25 14.6 24.4214 14 23.7143 14ZM24 24.5L20.5 23L17 24.5V15H24V24.5Z"
            fill={color}
        />
    </svg>
{/if}

<style>
    div {
        margin-top: 4rem;
    }
</style>
