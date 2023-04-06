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
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16.5064 15.3336V15.3333C16.5064 14.8555 16.8749 14.5 17.2857 14.5H23.7143C24.1283 14.5 24.5 14.8588 24.5 15.3333V25.2306L20.7031 23.5431L20.5 23.4528L20.2969 23.5431L16.5005 25.2304L16.5064 15.3336Z"
                stroke={color}
                fill={color == '#959595' ? 'transparent' : color}
            />
        </svg>
    </svg>
{/if}

<style>
    div {
        margin-top: 4rem;
    }
</style>
