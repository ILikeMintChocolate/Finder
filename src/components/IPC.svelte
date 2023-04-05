<script>
    import {
        currentPath,
        currentPathArray,
        initCurrentSelected,
        loadingCursor,
        metadata,
        pathHistory,
        pinned,
        zoom,
    } from '../state.js'

    window.electron.receive('app:init-current-Selected', () => {
        initCurrentSelected()
    })
    window.electron.receive('app:set-zoom', (arg) => {
        $zoom = arg
    })
    window.electron.receive('app:set-search', (arg) => {
        $pinned = arg
    })
    window.electron.receive('app:set-metadata', (arg) => {
        $metadata = arg
    })
    window.electron.receive('app:set-path-history', (arg) => {
        $pathHistory = [...$pathHistory, arg]
    })
    window.electron.receive('app:get-path', (arg) => {
        $currentPath = arg[0]
        $currentPathArray = arg[1]
    })
    window.electron.receive('app:generating-video-thumb', (arg) => {
        $loadingCursor = arg
    })
</script>
