const sqlite3 = require('sqlite3').verbose()
let db

const startDatabase = () => {
    return new Promise((resolve) => {
        db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
        db.run('CREATE TABLE IF NOT EXISTS USER (DEFAULT_PATH TEXT, ZOOM REAL);')
        db.run('CREATE TABLE IF NOT EXISTS PINNED (ID TEXT PRIMARY KEY, PATH TEXT, TITLE TEXT);')
        db.run('CREATE TABLE IF NOT EXISTS TAG (ID TEXT, TITLE TEXT);')
        db.run('CREATE TABLE IF NOT EXISTS METADATA (ID TEXT PRIMARY KEY, RATE INTEGER);')
        resolve()
    })
}

const getUserData = () => {
    return new Promise((resolve) => {
        db.get('SELECT * FROM USER;', [], (err, data) => {
            if (data == undefined) db.run(`INSERT INTO USER VALUES('C:\\', 1);`)
            resolve({
                defaultPath: data?.DEFAULT_PATH || 'C:\\',
                zoom: data?.ZOOM || 1,
            })
        })
    })
}

const getPinnedData = () => {
    return new Promise((resolve) => {
        db.all('SELECT * FROM PINNED;', [], (err, data) => resolve(data || []))
    })
}

const getTagData = (id) => {
    return new Promise((resolve) => {
        db.all('SELECT * FROM TAG WHERE ID = ?;', [id.toString()], (err, data) =>
            resolve(data.map((d) => d.TITLE) || [])
        )
    })
}

const getMetaData = () => {
    return new Promise((resolve) => {
        db.all('SELECT * FROM METADATA;', [], (err, data) => {
            Promise.all(
                data.map(async (d) => {
                    return { id: d.ID, rate: d.RATE, tag: await getTagData(d.ID) }
                })
            ).then((array) => resolve(array.reduce((a, c) => ({ ...a, [c.id]: c }), {})))
        })
    })
}

const setUserData = (key, value) => {
    if (key == 'zoom') key = 'ZOOM'
    else if (key == 'defaultPath') key = 'DEFAULT_PATH'
    return new Promise((resolve) => {
        db.run(`UPDATE USER SET ${key} = ?;`, [value], () => resolve())
    })
}

const setPinnedData = (currentPath) => {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM PINNED WHERE ID = ?;`, [currentPath.id.toString()], (err, data) => {
            if (data == undefined) {
                if (currentPath.path[currentPath.path.length - 1] == '\\')
                    currentPath.path = currentPath.path.slice(0, currentPath.path.length - 1)
                let pinSplit = currentPath.path.split('\\')
                db.run(
                    `INSERT INTO PINNED VALUES (?, ?, ?);`,
                    [currentPath.id.toString(), currentPath.path, pinSplit[pinSplit.length - 1]],
                    (err) => resolve()
                )
            } else db.run(`DELETE FROM PINNED WHERE ID = ?;`, [currentPath.id.toString()], () => resolve())
        })
    })
}

const setMetadataRate = (id, rate) => {
    return new Promise((resolve) =>
        db.run(`INSERT OR REPLACE INTO METADATA VALUES (?, ?);`, [id.toString(), parseInt(rate)], () => resolve())
    )
}

const setMetadataTag = (id, tag) => {
    return new Promise((resolve) => {
        db.run(`INSERT OR IGNORE INTO METADATA VALUES (?, ?);`, [id.toString(), 0], () => {
            db.run('DELETE FROM TAG WHERE ID = ?;', [id.toString()], () => {
                Promise.all(tag.map((t) => db.run('INSERT INTO TAG VALUES (?, ?);', [id.toString(), t]))).then(() =>
                    resolve()
                )
            })
        })
    })
}

//INSERT OR IGNORE INTO t (name) VALUES ('a');

module.exports = {
    startDatabase,
    getUserData,
    getPinnedData,
    setUserData,
    setPinnedData,
    getMetaData,
    setMetadataRate,
    setMetadataTag,
}
