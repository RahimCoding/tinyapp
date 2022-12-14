
// Dev Dependiences //

const express = require("express");
const app = express();
let cookieSession = require("cookie-session");
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");

//Helper Functions//

const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helpers");

// Sets up Cookies //

app.use(
  cookieSession({
    name: "session",
    keys: ["random string"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.set("view engine", "ejs");

// URL DATABASE TO STORE URLS //

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    user_id: "user_id",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    user_id: "user_id",
  },
};

// EMPTY USER OBJECT TO STORE USERS//

const users = {};

app.use(express.urlencoded({ extended: true }));

// GET REQUESTS //

app.get("/", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.redirect("/login");
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send("<a href='/login'> PLEASE LOGIN </a>");
  }
  const user = users[user_id];
  const templateVars = { urls: urlsForUser(user_id, urlDatabase), user: user };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    return res.redirect("/urls");
  }
  const user = users[user_id];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.redirect("/login");
  }
  const user = users[user_id];
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send("not logged in");
  }
  if (!urlDatabase[req.params.id]) {
    return res.send("not a valid short ID");
  }
  const user = users[user_id];
  if (urlDatabase[req.params.id].user_id !== user_id) {
    return res.send("error message");
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: user,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const url_id = req.params.id;
  const user_id = req.session.user_id;
  if (!urlDatabase[url_id]) {
    return res.send("not a valid short ID");
  }
  const longURL = urlDatabase[url_id].longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    return res.redirect("/urls");
  }
  const user = users[user_id];
  const templateVars = { user: user };
  res.render("registration", templateVars);
});

// POST REQUESTS //

app.post("/urls", (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.send("<a href='/login'> PLEASE LOGIN </a>");
  }
  const id = generateRandomString();
  const value = req.body.longURL;

  urlDatabase[id] = {
    longURL: value,
    user_id: req.session.user_id
  };

  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send("not logged in");
  }
  const delete_id = req.params.id;
  if (!urlDatabase[delete_id]) {
    return res.send("not a valid short ID");
  }

  if (urlDatabase[req.params.id].user_id !== user_id) {
    return res.send("error message");
  }
  delete urlDatabase[delete_id];
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send("not logged in");
  }
  const url_id = req.params.id;
  if (!urlDatabase[url_id]) {
    return res.send("not a valid short ID");
  }

  if (urlDatabase[req.params.id].user_id !== user_id) {
    return res.send("error message");
  }

  urlDatabase[url_id].longURL = req.body.newUrl;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {

  const user = getUserByEmail(req.body.email, users);

  if (!user) {
    return res.status(403).send("PLEASE REGISTER UR BREAKING MY CODE");
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(403).send("PLEASE CHECK YOUR PASSWORD :D");
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Email or Password should not be empty!");
  }
  for (const user in users) {
    if (users[user].email === req.body.email) {
      //for in loops for objects + [] for varibles `${user}`
      return res.status(400).send("email already taken");
    }
  }
  const id = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[id] = {
    id: id,
    email: req.body.email,
    password: hashedPassword,
  };
  req.session.user_id = id;
  res.redirect("/urls");
});
