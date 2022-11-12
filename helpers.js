
// GETS USER INFO VIA THEIR EMAIL //

const getUserByEmail = function (email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
};

// GETS THE URLS THE USER CREATED //

const urlsForUser = function (user_id, urlDatabase) {
  let userURLs = {};
  for (let urlKey in urlDatabase) {
    if (user_id === urlDatabase[urlKey].user_id) {
      userURLs[urlKey] = urlDatabase[urlKey];
    }
  }
  return userURLs;
};

//GENERATE RANDOM STRING FOR SECURITY//

const generateRandomString = function () {
  let result = "";
  const characters =
    "A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i <= 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};
