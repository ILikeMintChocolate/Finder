<script>
    import { metadata, currentSelectedFile, editMode } from '../../../state'
    export let mouseover, mouseoverRate
    let rate = 0
    $: $currentSelectedFile && setRate()
    $: $metadata && setRate()
    const setRate = () => {
        if ($metadata[$currentSelectedFile.hash] != undefined) rate = $metadata[$currentSelectedFile.hash].rate
    }
</script>

<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7 11.2516V0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 0.5 ? '#FFCF23' : rate >= 0.5 ? '#FFCF23' : '#FFFFFF'}
    />
    <path
        d="M7 11.2516V0L8.967 4.88526L14 5.33474L10.178 8.82L11.326 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 1 ? '#FFCF23' : rate >= 1 ? '#FFCF23' : '#FFFFFF'}
    />
</svg>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7 11.2516V0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 1.5 ? '#FFCF23' : rate >= 1.5 ? '#FFCF23' : '#FFFFFF'}
    />
    <path
        d="M7 11.2516V0L8.967 4.88526L14 5.33474L10.178 8.82L11.326 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 2 ? '#FFCF23' : rate >= 2 ? '#FFCF23' : '#FFFFFF'}
    />
</svg>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7 11.2516V0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 2.5 ? '#FFCF23' : rate >= 2.5 ? '#FFCF23' : '#FFFFFF'}
    />
    <path
        d="M7 11.2516V0L8.967 4.88526L14 5.33474L10.178 8.82L11.326 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 3 ? '#FFCF23' : rate >= 3 ? '#FFCF23' : '#FFFFFF'}
    />
</svg>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7 11.2516V0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 3.5 ? '#FFCF23' : rate >= 3.5 ? '#FFCF23' : '#FFFFFF'}
    />
    <path
        d="M7 11.2516V0L8.967 4.88526L14 5.33474L10.178 8.82L11.326 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 4 ? '#FFCF23' : rate >= 4 ? '#FFCF23' : '#FFFFFF'}
    />
</svg>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7 11.2516V0L5.033 4.88526L0 5.33474L3.822 8.82L2.674 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 4.5 ? '#FFCF23' : rate >= 4.5 ? '#FFCF23' : '#FFFFFF'}
    />
    <path
        d="M7 11.2516V0L8.967 4.88526L14 5.33474L10.178 8.82L11.326 14L7 11.2516Z"
        fill={$editMode && mouseover && mouseoverRate >= 5 ? '#FFCF23' : rate >= 5 ? '#FFCF23' : '#FFFFFF'}
    />
</svg>
