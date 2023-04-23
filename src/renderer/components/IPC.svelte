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
        clearCurrentSelectedFile,
        loadingCursor,
        metadata,
        pinned,
        searchOption,
        tagList,
        zoom,
        prePageStack,
        nextPageStack,
    } from '../state.js'

    window.electron.receive('app:clear-current-selected-file', () => {
        clearCurrentSelectedFile()
    })
    window.electron.receive('app:get-zoom', (arg) => {
        $zoom = arg
    })
    window.electron.receive('app:get-defaultPath', (arg) => {
        $defaultPath = arg
    })
    window.electron.receive('app:get-pinned', (arg) => {
        $pinned = arg
    })
    window.electron.receive('app:set-metadata', (arg) => {
        $metadata = arg
    })
    window.electron.receive('app:get-path', (arg) => {
        $currentPath = arg[0]
        $currentPathArray = arg[0].path.split('\\').filter((p) => p != '')
        $currentPathArray[0] = $currentPathArray[0].replaceAll(':', '')
        $prePageStack = arg[1]
        $nextPageStack = arg[2]
    })
    window.electron.receive('app:generating-video-thumb', (arg) => {
        $loadingCursor = arg
    })
    window.electron.receive('app:get-files', (arg) => {
        $currentFileRate = arg[1]
        $tagList = arg[2]
        $extensionList = arg[3]
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

    window.electron.receive('app:get-all-child-files', (arg) => {
        $currentFileRate = arg.rate
        $extensionList = arg.ext
        $tagList = arg.tag
        let folderList = [],
            imageList = [],
            videoList = [],
            fileList = []
        arg.data.forEach((file) => {
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
