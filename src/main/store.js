class User {
    constructor() {
        this.defaultPath = 'C:\\'
    }

    set(key, value) {
        switch (key) {
            case 'defaultPath':
                this.defaultPath = value
                break
        }
    }
}

let user = new User()
module.exports = { user }
