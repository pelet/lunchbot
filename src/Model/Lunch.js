'use strict'

const fs = require('fs')

class Lunch {

    constructor(filePath) {
        this.file = filePath
    }

    getAll() {
        return this.getData()
    }

    getRandom() {
        const all = this.getData()
        const index = this.getRandomInt(0, all.length)
        return all[index]
    }

    get(name) {
        const all = this.getData()
        const result = all.find((elem) => {
            return elem.name.toLowerCase() === name.toLowerCase()
        })
        return result
    }

    add(name, menu) {
        const all = this.getData()
        all.push({
            'name': name,
            'menu': menu ? menu : '',
        })
        return this.saveData(all)
    }

    remove(name) {
        const all = this.getData()
        const itemRemoved = all.filter((elem) => {
            return elem.name.toLowerCase() !== name.toLowerCase()
        })
        return this.saveData(itemRemoved)
    }

    getData() {
        try {
            return JSON.parse(fs.readFileSync(this.file, 'utf8'))
        } catch(e) {
            console.log("Error reading file: " + e)
            return []
        }
    }
    
    saveData(data) {
        try {
            fs.writeFile(this.file, JSON.stringify(data, null, 2), 'utf8', (err) => {
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
    
    getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }

};

module.exports = Lunch
