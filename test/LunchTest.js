'use strict'

const assert = require('assert')
const fs = require('fs')
const Lunch = require('./../src/Model/Lunch')

describe('Lunch', () => {
    const data = [
        {
          "name": "Stonebase",
          "menu": "https://www.lounaat.info/lounas/stonebase/helsinki"
        },
        {
          "name": "Loru",
          "menu": "https://www.lounaat.info/lounas/loru/helsinki"
        },
        {
          "name": "Borneo",
          "menu": "http://www.ravintolaborneo.fi/restaurant/helsinki/"
        }
    ]
    let lunch

    before(() => {
        fs.writeFileSync('./test/Fixture/db.json', JSON.stringify(data, null, 2), 'utf8')
        lunch = new Lunch('./test/Fixture/db.json')
    })

    after(() => {
        fs.writeFileSync('./test/Fixture/db.json', JSON.stringify(data, null, 2), 'utf8')
    })

    describe('function getAll', () => {
        it('should return all of the data', () => {
            const expected = lunch.getAll()
            assert.deepEqual(expected, data)
        })
    })

    describe('function getRandom', () => {
        it('should return one restaurant randomly', () => {
            const expected = lunch.getRandom()
            const restaurantFromData = lunch.get(expected.name)
            assert.deepEqual(expected, restaurantFromData)
        })
    })

    describe('function get', () => {
        it('should return restaurant by name', () => {
            const restaurantName = 'Stonebase'
            const expected = lunch.get(restaurantName)
            assert.deepEqual(expected.name, restaurantName)
        })
    })

    describe('function add', () => {
        it('should add restaurant to data', () => {
            const restaurantName = 'TestRestaurant'
            const result = lunch.add(restaurantName)
            assert.ok(result)
            const expected = lunch.get(restaurantName)
            assert.equal(expected.name, restaurantName)

            const name = 'RestName'
            const menu = 'menuURL'
            const result2 = lunch.add(name, menu)
            assert.ok(result2)
            const expected2 = lunch.get(name)
            assert.equal(expected2.name, name)
            assert.equal(expected2.menu, menu)
        })
    })

    describe('function remove', () => {
        it('should remove restaurant from data', () => {
            const restaurantName = 'Loru'
            const expected = lunch.get(restaurantName)
            assert.equal(expected.name, restaurantName)
            
            const result = lunch.remove(restaurantName)
            assert.ok(result)

            const expected2 = lunch.get(restaurantName)
            assert.equal(expected2, undefined)
        })
    })

})
    