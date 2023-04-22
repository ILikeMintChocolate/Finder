const fs = require('fs')

class Path {
    constructor(id, path) {
        this.id = id
        this.path = path
    }
}

class Browser {
    constructor() {
        this.currentPath = null
        this.pre = []
        this.next = []
    }

    setCurrentPath(path) {
        if (path instanceof Object) this.currentPath = path
        else {
            let stat = fs.statSync(path)
            this.currentPath = new Path(`${stat.ino}${parseInt(stat.birthtimeMs)}`, path)
        }
    }

    getCurrentPath() {
        return this.currentPath
    }

    newPage(path) {
        if (this.currentPath?.path == path) return 0
        if (this.currentPath) this.pre.push(this.currentPath)
        this.next = []
        this.setCurrentPath(path)
    }

    prePage() {
        if (this.pre.length) {
            this.next.push(this.currentPath)
            this.setCurrentPath(this.pre.pop())
        }
    }

    nextPage() {
        if (this.next.length) {
            this.pre.push(this.currentPath)
            this.setCurrentPath(this.next.pop())
        }
    }

    getBrowserStack() {
        return [this.currentPath, this.pre, this.next]
    }
}
module.exports = { browser: new Browser() }
