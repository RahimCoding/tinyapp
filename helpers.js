function getUserByEmail(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
}

function urlsForUser(user_id, urlDatabase) {
  let userURLs = {};
  for (let urlKey in urlDatabase) {
    if (user_id === urlDatabase[urlKey].user_id) {
      userURLs[urlKey] = urlDatabase[urlKey];
    }
  }
  return userURLs;
}

function generateRandomString() {
  var result = "";
  var characters =
    "A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i <= 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};
