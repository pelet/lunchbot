'use strict'

const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('./../src')

chai.use(chaiHttp)

describe('LunchService', () => {
  describe('handleRequests', () => {
    const body = {
      token: 'testtoken',
      team_id: 'testteamid',
    }

    it('should return instructions when text help is passed', (done) => {
      body.text = 'help'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"Available commands:","attachments":[{"text":"suggest (optional) - Let Lunch Service suggest a restaurant"},{"text":"help - Shows this message"},{"text":"list - List all restaurants with menus"},{"text":"get [name_of_restaurant] - Get the menu for the restaurant"},{"text":"add [name_of_restaurant] [menu_URL (optional)] - Add a restaurant to Lunch Service"},{"text":"remove [name_of_restaurant] - Remove the restaurant from Lunch Service"}]}')
          done()
        })
    })

    it('should return all restaurants when text list is passed', (done) => {
      body.text = 'list'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"in_channel","text":"Available restaurants:","attachments":[{"text":"Stonebase - https://www.lounaat.info/lounas/stonebase/helsinki"},{"text":"Loru - https://www.lounaat.info/lounas/loru/helsinki"},{"text":"Borneo - http://www.ravintolaborneo.fi/restaurant/helsinki/"}]}')
          done()
        })
    })

    it('should get the restaurant when text get name is passed', (done) => {
      body.text = 'get Loru'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"in_channel","text":"Menu for Loru:","attachments":[{"text":"https://www.lounaat.info/lounas/loru/helsinki"}]}')
          done()
        })
    })

    it('should provide an error message when trying to get with no restaurant name', (done) => {
      body.text = 'get'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"Please provide the restaurant name after the get command.","attachments":[]}')
          done()
        })
    })

    it('should provide an error message when trying to get with wrong restaurant name', (done) => {
      body.text = 'get wrongname'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"No restaurant found with the name wrongname. Please add the restaurant with the add command.","attachments":[]}')
          done()
        })
    })

    it('should add the restaurant when text add name menu is passed', (done) => {
      body.text = 'add Testname menuURL'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"Restaurant Testname with menu added succesfully.","attachments":[]}')
          done()
        })
    })

    it('should provide an error message when trying to add with no restaurant name', (done) => {
      body.text = 'add'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"Please provide the restaurant name after the add command."}')
          done()
        })
    })

    it('should remove the restaurant when text remove name is passed', (done) => {
      body.text = 'remove Testname'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"Restaurant Testname removed succesfully.","attachments":[]}')
          done()
        })
    })

    it('should provide an error message when trying to remove with no restaurant name', (done) => {
      body.text = 'remove'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"Please provide the restaurant name after the remove command."}')
          done()
        })
    })

    it('should provide an error message when trying to remove with wrong restaurant name', (done) => {
      body.text = 'remove wrongname'
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          assert.equal(res.text, '{"response_type":"ephemeral","text":"Restaurant with the name wrongname does not exist!","attachments":[]}')
          done()
        })
    })

    it('should suggest a random restaurant when no text is passed', (done) => {
      body.text = ''
      chai.request(app)
        .post('/lunchbot')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          chai.expect(res).to.have.status(200)
          console
          assert.equal(res.text.substring(0, 81), '{"response_type":"in_channel","text":"Try this one today:","attachments":[{"text"')
          done()
        })
    })
  })
})