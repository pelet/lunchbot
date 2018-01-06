'use strict'

const Config = require('./../Common/Config')

class LunchService {

    constructor(lunch) {
        this.lunch = lunch
    }

    handleRequest(req, res) {
        const data = req.body

        if (data.token !== Config.slack.VERIFICATION_TOKEN || data.team_id !== Config.slack.TEAM_ID) {
            return
        }

        const command = this.getCommand(data.text)
        switch(command) {
            case('help'):
                return this.instructions(res)
                break

            case('list'):
                return this.list(res)
                break

            case('get'):
                return this.get(res, data.text)
                break

            case('add'):
                return this.add(res, data.text)
                break

            case('remove'):
                return this.remove(res, data.text)
                break

            default:
                return this.suggest(res)
        }
    }

    instructions(res) {
        const attachments = [
            {
                'text':'suggest (optional) - Let Lunch Service suggest a restaurant'
            },
            {
                'text':'help - Shows this message'
            },
            {
                'text':'list - List all restaurants with menus'
            },
            {
                'text':'get [name_of_restaurant] - Get the menu for the restaurant'
            },
            {
                'text':'add [name_of_restaurant] [menu_URL (optional)] - Add a restaurant to Lunch Service'
            },
            {
                'text':'remove [name_of_restaurant] - Remove the restaurant from Lunch Service'
            },
        ]
        return this.sendResponse(res, 'ephemeral', 'Available commands:', attachments)
    }
    
    suggest(res) {
        const random = this.lunch.getRandom()
        if (!random) {
            return this.sendResponse(res, 'ephemeral', 'No restaurants to suggest.')
        }
        const attachments = [
            {
                'text': random.name + (random.menu ? ' - ' + random.menu : '')
            }
        ]
        return this.sendResponse(res, 'in_channel', 'Try this one today:', attachments)
    }
    
    list(res) {
        const all = this.lunch.getAll()
        if (all.length === 0) {
            return this.sendResponse(res, 'ephemeral', 'No restaurants available. Please add some with the add command.')
        }
        const attachments = all.map((restaurant) => {
            return {'text': restaurant.name + (restaurant.menu ? ' - ' + restaurant.menu : ' - (no menu available)')}
        })
        return this.sendResponse(res, 'in_channel', 'Available restaurants:', attachments)
    }
    
    get (res, text) {
        const name = this.getName(text)
        if (!name) {
            return this.sendResponse(res, 'ephemeral', 'Please provide the restaurant name after the get command.')
        }
        const restaurant = this.lunch.get(name)
        if (!restaurant) {
            return this.sendResponse(res, 'ephemeral', 'No restaurant found with the name ' + name + '. Please add the restaurant with the add command.')
        }
        if (!restaurant.menu) {
            return this.sendResponse(res, 'ephemeral', 'No menu found for ' + name + '.')
        }
        const attachments = [
            {
                'text': restaurant.menu
            }
        ]
        return this.sendResponse(res, 'in_channel', 'Menu for ' + name + ':', attachments)
    }
    
    add (res, text) {
        const name = this.getName(text)
        if (!name) {
            const response = {
                'response_type': 'ephemeral',
                'text': 'Please provide the restaurant name after the add command.',
            }
            res.json(response)
            return
        }
        const restaurant = this.lunch.get(name)
        if (restaurant) {
            return this.sendResponse(res, 'ephemeral', 'Restaurant with the name ' + name + ' exists already!')
        }
    
        const menu = this.getMenu(text)
    
        if (this.lunch.add(name, menu)) {
            const menuText = menu ? ' with menu' : ''
            return this.sendResponse(res, 'ephemeral', 'Restaurant ' + name + menuText + ' added succesfully.')
        }
        return this.sendResponse(res, 'ephemeral', 'Adding restaurant failed.')
    }
    
    remove (res, text) {
        const name = this.getName(text)
        if (!name) {
            const response = {
                'response_type': 'ephemeral',
                'text': 'Please provide the restaurant name after the remove command.',
            }
            res.json(response)
            return
        }
        const restaurant = this.lunch.get(name)
        if (!restaurant) {
            return this.sendResponse(res, 'ephemeral', 'Restaurant with the name ' + name + ' does not exist!')
        }
    
        if (this.lunch.remove(name)) {
            return this.sendResponse(res, 'ephemeral', 'Restaurant ' + name + ' removed succesfully.')
        }
        return this.sendResponse(res, 'ephemeral', 'Removing restaurant failed.')
    }
    
    sendResponse(res, type, text, attachments = []) {
        const response = {
            'response_type': type,
            'text': text,
            'attachments': attachments
        }
        res.json(response)
        return
    }
    
    getCommand(text) {
        return text.split(' ')[0]
    }
    
    getName(text) {
        return text.split(' ')[1]
    }
    
    getMenu(text) {
        return text.split(' ')[2]
    }
};


module.exports = LunchService
