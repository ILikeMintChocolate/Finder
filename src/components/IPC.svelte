<script>
    import {
        currentFileList,
        currentFileRate,
        currentFolderList,
        currentImageList,
        currentPath,
        currentPathArray,
        currentVideoList,
        defaultPath,
        extensionList,
        initCurrentSelected,
        loadingCursor,
        metadata,
        pathHistory,
        pinned,
        searchOption,
        zoom,
    } from '../state.js'

    window.electron.receive('app:init-current-Selected', () => {
        initCurrentSelected()
    })
    window.electron.receive('app:set-zoom', (arg) => {
        $zoom = arg
    })
    window.electron.receive('app:set-defaultPath', (arg) => {
        $defaultPath = arg
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
    window.electron.receive('app:get-files', (arg) => {
        $currentFileRate = arg[1]
        $extensionList = arg[2]
        let folderList = [],
            imageList = [],
            videoList = [],
            fileList = []
        arg[0].forEach((file) => {
            let type = file.type.split('/')[0]
            if (type == 'folder') folderList.push(file)
            else if (type == 'image') imageList.push(file)
            else if (type == 'video') videoList.push(file)
            else fileList.push(file)
        })
        $currentFolderList = folderList
        $currentImageList = imageList
        $currentVideoList = videoList
        $currentFileList = fileList
        $searchOption.rate = [false, false, false, false, false]
    })
</script>
