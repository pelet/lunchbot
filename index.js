const express = require('express')
const request = require('request')

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const PORT = process.env.PORT

var app = express()

app.listen(PORT, () => {
    console.log("Lunch bot listening on port " + PORT)
})

app.get('/', (req, res) => {
    res.send('Nothing here: ' + req.url)
})

app.get('/lunchbot/oauth', (req, res) => {
    if (!req.query.code) {
        res.status(500)
        res.send("Error")
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
                console.log(error)
            } else {
                res.json(body)
            }
        })
    }
})


app.post('/lunchbot', (req, res) => {
    res.send('Lunchbot here!')
})