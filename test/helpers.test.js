const { assert } = require('chai');

const { getUserID } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserID', function() {
  it('should return a user with valid email', function() {
    const user = getUserID(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });
  it('should return undefined when passed invalid email', function() {
    const user = getUserID(testUsers, "user@google.com");
    const expectedOutput = undefined;
    assert.equal(user.id, expectedOutput);
  });
});