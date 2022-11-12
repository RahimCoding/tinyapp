const { assert } = require("chai");

// FUNCTIONS TO TEST //

const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("../helpers.js");

//TEST DATA//

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const testURLs = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    user_id: "test",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    user_id: "userRandomID",
  },
};

//MOCHA AND CHAI TESTS//

describe("getUserByEmail", function () {

  it("should return a user with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, "userRandomID");
  });

  it("should return a undefined with an non-existant email", function () {
    const user = getUserByEmail("user3@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.isUndefined(user.id, "userRandomID");
  });

});

describe("generateRandomString()", function () {

  it("should return string with valid length: 7", function () {
    const generateRandomStrings = generateRandomString();
    assert.strictEqual(generateRandomStrings.length, 7);
  });

});

describe("urlsForUser", function () {

  it("Should get urls for the specific user:", function () {
    const user_id = "test";

    const result = urlsForUser(user_id, testURLs);

    assert.deepEqual(result, {
      b2xVn2: {
        longURL: "http://www.lighthouselabs.ca",
        user_id: "test",
      },

    });

  });

  it("Should return null for the user without a url:", function () {
    const user_id = "fakeID";
    const result = urlsForUser(user_id, testURLs);
    
    assert.deepEqual(result, {});
  });
});
