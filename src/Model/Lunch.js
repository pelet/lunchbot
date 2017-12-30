'use strict'

const fs = require('fs')

module.exports = {
    getAll: () => {
        return getData()
    },

    getRandom: () => {
        const all = getData()
        const index = getRandomInt(0, all.length)
        return all[index]
    },

    get: (name) => {
        const all = getData()
        const result = all.find((elem) => {
            return elem.name.toLowerCase() === name.toLowerCase()
        })
        return result
    },

    add: (name, menu) => {
        const all = getData()
        all.push({
            'name': name,
            'menu': menu ? menu : '',
        })
        return saveData(all)
    },

    remove: (name) => {
        const all = getData()
        const itemRemoved = all.filter((elem) => {
            return elem.name.toLowerCase() !== name.toLowerCase()
        })
        return saveData(itemRemoved)
    },

};

const getData = () => {
    try {
        return JSON.parse(fs.readFileSync(process.env.DB_FILE, 'utf8'))
    } catch(e) {
        console.log("Error reading file: " + e)
        return []
    }
}

const saveData = (data) => {
    try {
        fs.writeFile(process.env.DB_FILE, JSON.stringify(data, null, '\t'), 'utf8', (err) => {
            if (err) {
                console.log("Error writing file: " + err)
                throw err
            }
          })
          return true
    } catch(e) {
        console.log("Error writing file: " + e)
        return false
    }
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}