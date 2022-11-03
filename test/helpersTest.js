const { assert } = require('chai');

const { getUserByEmail, generateRandomString } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, "userRandomID")
    // Write your assert statement here
  });
  it('should return a undefined with an non-existant email', function() {
    const user = getUserByEmail("user3@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.isUndefined(user.id, "userRandomID")
    // Write your assert statement here
  });
});

describe("generateRandomString(length)", function() {
  it("should return string with valid length: 7", function() {
    const generateRandomStrings = generateRandomString()
    assert.strictEqual(generateRandomStrings.length, 7)
  });
});