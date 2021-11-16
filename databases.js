const bcrypt = require('bcryptjs');

//OBJECT OF URLS
const urlDatabase = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'pontiacbandit'
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'userRandomID'
  },

};

//OBJECT OF USERS
let users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcrypt.hashSync('purple', 10)
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcrypt.hashSync('funk', 10)
  },
  'pontiacbandit': {
    id: 'pontiacbandit',
    email: 'pontiac@bandit.com',
    password: bcrypt.hashSync('jakeperalta', 10)
  }
};

module.exports = { users, urlDatabase };