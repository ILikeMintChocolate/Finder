<script>
    import { searchOption, currentFileRate } from '../../../state'
    import StarIcon from './StarIcon.svelte'
    let mouseover1, mouseover2, mouseover3, mouseover4, mouseover5
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="search-rate-wrapper fc">
    <div
        class="fr fsbetween"
        on:click={() => ($searchOption.rate[4] = !$searchOption.rate[4])}
        on:mouseover={() => (mouseover5 = true)}
        on:mouseleave={() => (mouseover5 = false)}
    >
        <div class="rate-star-wrapper fr">
            <StarIcon fill={$searchOption.rate[4]} mouseover={mouseover5} />
            <StarIcon fill={$searchOption.rate[4]} mouseover={mouseover5} />
            <StarIcon fill={$searchOption.rate[4]} mouseover={mouseover5} />
            <StarIcon fill={$searchOption.rate[4]} mouseover={mouseover5} />
            <StarIcon fill={$searchOption.rate[4]} mouseover={mouseover5} />
        </div>
        <span style="color:{$searchOption.rate[4] ? '#FFCF23' : mouseover5 ? 'var(--white)' : '#CACACA'}"
            >{$currentFileRate[4]}</span
        >
    </div>
    <div
        class="fr fsbetween"
        on:click={() => ($searchOption.rate[3] = !$searchOption.rate[3])}
        on:mouseover={() => (mouseover4 = true)}
        on:mouseleave={() => (mouseover4 = false)}
    >
        <div class="rate-star-wrapper fr">
            <StarIcon fill={$searchOption.rate[3]} mouseover={mouseover4} />
            <StarIcon fill={$searchOption.rate[3]} mouseover={mouseover4} />
            <StarIcon fill={$searchOption.rate[3]} mouseover={mouseover4} />
            <StarIcon fill={$searchOption.rate[3]} mouseover={mouseover4} />
        </div>
        <span style="color:{$searchOption.rate[3] ? '#FFCF23' : mouseover5 ? 'var(--white)' : '#CACACA'}"
            >{$currentFileRate[3]}</span
        >
    </div>

    <div
        class="fr fsbetween"
        on:click={() => ($searchOption.rate[2] = !$searchOption.rate[2])}
        on:mouseover={() => (mouseover3 = true)}
        on:mouseleave={() => (mouseover3 = false)}
    >
        <div class="rate-star-wrapper fr">
            <StarIcon fill={$searchOption.rate[2]} mouseover={mouseover3} />
            <StarIcon fill={$searchOption.rate[2]} mouseover={mouseover3} />
            <StarIcon fill={$searchOption.rate[2]} mouseover={mouseover3} />
        </div>
        <span style="color:{$searchOption.rate[2] ? '#FFCF23' : mouseover5 ? 'var(--white)' : '#CACACA'}"
            >{$currentFileRate[2]}</span
        >
    </div>
    <div
        class="fr fsbetween"
        on:click={() => ($searchOption.rate[1] = !$searchOption.rate[1])}
        on:mouseover={() => (mouseover2 = true)}
        on:mouseleave={() => (mouseover2 = false)}
    >
        <div class="rate-star-wrapper fr">
            <StarIcon fill={$searchOption.rate[1]} mouseover={mouseover2} />
            <StarIcon fill={$searchOption.rate[1]} mouseover={mouseover2} />
        </div>
        <span style="color:{$searchOption.rate[1] ? '#FFCF23' : mouseover5 ? 'var(--white)' : '#CACACA'}"
            >{$currentFileRate[1]}</span
        >
    </div>
    <div
        class="fr fsbetween"
        on:click={() => ($searchOption.rate[0] = !$searchOption.rate[0])}
        on:mouseover={() => (mouseover1 = true)}
        on:mouseleave={() => (mouseover1 = false)}
    >
        <div class="rate-star-wrapper fr">
            <StarIcon fill={$searchOption.rate[0]} mouseover={mouseover1} />
        </div>
        <span style="color:{$searchOption.rate[0] ? '#FFCF23' : mouseover5 ? 'var(--white)' : '#CACACA'}"
            >{$currentFileRate[0]}</span
        >
    </div>
</div>

<style>
    .search-rate-wrapper {
        gap: 10rem;
    }
    .rate-star-wrapper {
        gap: 4rem;
    }
    span {
        line-height: 14rem;
        font-size: 13rem;
        color: #cacaca;
    }
</style>
