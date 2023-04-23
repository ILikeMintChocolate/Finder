<script>
    import { contextMenu } from '../state'
</script>

<div id="context-menu-wrapper" class="fc" style="visibility: {$contextMenu ? 'visible' : 'hidden'};">
    <ul>
        <li class="no-drag">Open</li>
        <li class="no-drag">Reveal in Explorer</li>
    </ul>
    <hr />
    <ul>
        <li class="no-drag">Copy</li>
        <li class="no-drag">Paste</li>
        <li class="no-drag">Copy Path</li>
    </ul>
    <hr />
    <ul>
        <li class="no-drag">Rename</li>
        <li class="no-drag">Delete</li>
    </ul>
</div>

<style>
    #context-menu-wrapper {
        position: absolute;
        width: 150rem;
        box-sizing: border-box;
        background-color: #282828;
        z-index: 100000;
    }
    ul {
        padding: 0;
        list-style-type: none;
        padding: 8rem 0 8rem 0;
    }
    li {
        font-size: 12rem;
        line-height: 26rem;
        padding: 0 20rem 0 20rem;
        color: #ffffff;
        transition: background-color 0.2s;
    }
    li:hover {
        background-color: #00a3ff;
    }
    hr {
        width: 100%;
        box-sizing: border-box;
        border: 1rem solid #373737;
    }
</style>
