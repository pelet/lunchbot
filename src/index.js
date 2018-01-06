'use strict'

const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const LunchService = require('./Controller/LunchService')
const Lunch = require('./Model/Lunch')
const Config = require('./Common/Config')

const clientId = Config.slack.CLIENT_ID
const clientSecret = Config.slack.CLIENT_SECRET
const PORT = Config.PORT
const dbFile = Config.DB_FILE

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

const lunchService = new LunchService(new Lunch(dbFile))

app.get('/lunchbot/oauth', (req, res) => {
    if (!req.query.code) {
        res.status(500)
        res.send('Error')
    } else {
        request({
            url: 'https://slack.com/api/oauth.access',
            qs: {
                code: req.query.code,
                client_id: clientId,
                client_secret: clientSecret
            },
            method: 'GET',

        }, (error, response, body) => {
            if (error) {
                console.log('Error Slack oauth: ' + error)
            } else {
                res.json(body)
            }
        })
    }
})

app.post('/lunchbot', (req, res) => {
    lunchService.handleRequest(req, res)
})

app.listen(PORT, () => {
    console.log('Lunch bot listening on port ' + PORT)
})