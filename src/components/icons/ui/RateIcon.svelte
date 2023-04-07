<script>
    import { metadata, currentSelectedFile, editMode } from '../../../state'
    let currentRate = 0,
        mouseoverRate = 0,
        mouseover = false,
        rate = 0
    $: $currentSelectedFile && setRate()
    $: $metadata && setRate()
    const setRate = () => {
        if ($metadata[$currentSelectedFile.hash] != undefined) {
            rate = $metadata[$currentSelectedFile.hash]?.rate
        } else {
            rate = 0
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    class="rate-star-wrapper fr"
    on:click={(event) => {
        if ($editMode == true) {
            if (event.layerX < 0) {
                currentRate = 0
            } else if (event.layerX < 16) {
                currentRate = 1
            } else if (event.layerX < 35) {
                currentRate = 2
            } else if (event.layerX < 54) {
                currentRate = 3
            } else if (event.layerX < 73) {
                currentRate = 4
            } else {
                currentRate = 5
            }
            if ($metadata[$currentSelectedFile.hash] == undefined) {
                $metadata[$currentSelectedFile.hash] = {
                    rate: currentRate,
                    tag: [],
                }
            } else {
                $metadata[$currentSelectedFile.hash].rate = currentRate
            }
        }
    }}
    on:mouseover={() => (mouseover = true)}
    on:mouseleave={() => (mouseover = false)}
    on:mousemove={(event) => {
        if (mouseover && $editMode) {
            if (event.layerX < 0) {
                mouseoverRate = 0
            } else if (event.layerX < 16) {
                mouseoverRate = 1
            } else if (event.layerX < 35) {
                mouseoverRate = 2
            } else if (event.layerX < 54) {
                mouseoverRate = 3
            } else if (event.layerX < 73) {
                mouseoverRate = 4
            } else {
                mouseoverRate = 5
            }
        }
    }}
>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7 11.2516L11.326 14L10.178 8.82L14 5.33474L8.967 4.88526L7 0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
            fill={$editMode && mouseover && mouseoverRate >= 1 ? '#FFCF23' : rate >= 1 ? '#FFCF23' : '#FFFFFF'}
        />
    </svg>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7 11.2516L11.326 14L10.178 8.82L14 5.33474L8.967 4.88526L7 0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
            fill={$editMode && mouseover && mouseoverRate >= 2 ? '#FFCF23' : rate >= 2 ? '#FFCF23' : '#FFFFFF'}
        />
    </svg>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7 11.2516L11.326 14L10.178 8.82L14 5.33474L8.967 4.88526L7 0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
            fill={$editMode && mouseover && mouseoverRate >= 3 ? '#FFCF23' : rate >= 3 ? '#FFCF23' : '#FFFFFF'}
        />
    </svg>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7 11.2516L11.326 14L10.178 8.82L14 5.33474L8.967 4.88526L7 0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
            fill={$editMode && mouseover && mouseoverRate >= 4 ? '#FFCF23' : rate >= 4 ? '#FFCF23' : '#FFFFFF'}
        />
    </svg>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7 11.2516L11.326 14L10.178 8.82L14 5.33474L8.967 4.88526L7 0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
            fill={$editMode && mouseover && mouseoverRate >= 5 ? '#FFCF23' : rate >= 5 ? '#FFCF23' : '#FFFFFF'}
        />
    </svg>
</div>

<style>
    .rate-star-wrapper {
        gap: 4rem;
        width: fit-content;
        margin-left: -20rem;
        padding: 2rem 20rem 2rem 20rem;
    }
</style>
