'use strict'

const Lunch = require('./../Model/Lunch')

module.exports = {
    handleRequest: (req, res) => {
        const data = req.body

        if (data.token !== process.env.VERIFICATION_TOKEN || data.team_id !== process.env.TEAM_ID) {
            return
        }

        const command = getCommand(data.text)
        switch(command) {
            case('help'):
                return instructions(res)
                break

            case('list'):
                return list(res)
                break

            case('get'):
                return get(res, data.text)
                break

            case('add'):
                return add(res, data.text)
                break

            case('remove'):
                return remove(res, data.text)
                break

            default:
                return suggest(res)
        }
    }
};

const instructions = (res) => {
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
    return sendResponse(res, 'ephemeral', 'Available commands:', attachments)
}

const suggest = (res) => {
    const random = Lunch.getRandom()
    if (!random) {
        return sendResponse(res, 'ephemeral', 'No restaurants to suggest.')
    }
    const attachments = [
        {
            'text': random.name + (random.menu ? ' - ' + random.menu : '')
        }
    ]
    return sendResponse(res, 'in_channel', 'Try this one today:', attachments)
}

const list = (res) => {
    const all = Lunch.getAll()
    if (all.length === 0) {
        return sendResponse(res, 'ephemeral', 'No restaurants available. Please add some with the add command.')
    }
    const attachments = all.map((restaurant) => {
        return {'text': restaurant.name + (restaurant.menu ? ' - ' + restaurant.menu : ' - (no menu available)')}
    })
    return sendResponse(res, 'in_channel', 'Available restaurants:', attachments)
}

const get = (res, text) => {
    const name = getName(text)
    if (!name) {
        return sendResponse(res, 'ephemeral', 'Please provide the restaurant name after the get command.')
    }
    const restaurant = Lunch.get(name)
    if (!restaurant) {
        return sendResponse(res, 'ephemeral', 'No restaurant found with the name ' + name + '. Please add the restaurant with the add command.')
    }
    if (!restaurant.menu) {
        return sendResponse(res, 'ephemeral', 'No menu found for ' + name + '.')
    }
    const attachments = [
        {
            'text': restaurant.menu
        }
    ]
    return sendResponse(res, 'in_channel', 'Menu for ' + name + ':', attachments)
}

const add = (res, text) => {
    const name = getName(text)
    if (!name) {
        const response = {
            'response_type': 'ephemeral',
            'text': 'Please provide the restaurant name after the add command.',
        }
        res.json(response)
        return
    }
    const restaurant = Lunch.get(name)
    if (restaurant) {
        return sendResponse(res, 'ephemeral', 'Restaurant with the name ' + name + ' exists already!')
    }

    const menu = getMenu(text)

    if (Lunch.add(name, menu)) {
        const menuText = menu ? ' with menu' : ''
        return sendResponse(res, 'ephemeral', 'Restaurant ' + name + menuText + ' added succesfully.')
    }
    return sendResponse(res, 'ephemeral', 'Adding restaurant failed.')
}

const remove = (res, text) => {
    const name = getName(text)
    if (!name) {
        const response = {
            'response_type': 'ephemeral',
            'text': 'Please provide the restaurant name after the remove command.',
        }
        res.json(response)
        return
    }
    const restaurant = Lunch.get(name)
    if (!restaurant) {
        return sendResponse(res, 'ephemeral', 'Restaurant with the name ' + name + ' does not exist!')
    }

    if (Lunch.remove(name)) {
        return sendResponse(res, 'ephemeral', 'Restaurant ' + name + ' removed succesfully.')
    }
    return sendResponse(res, 'ephemeral', 'Removing restaurant failed.')
}


const sendResponse = (res, type, text, attachments = []) => {
    const response = {
        'response_type': type,
        'text': text,
        'attachments': attachments
    }
    res.json(response)
    return
}

const getCommand = (text) => {
    return text.split(' ')[0]
}

const getName = (text) => {
    return text.split(' ')[1]
}

const getMenu = (text) => {
    return text.split(' ')[2]
}