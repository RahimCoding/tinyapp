function generateRandomString() {
  var result = '';
  var characters = 'A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i <= 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const { request, response } = require("express");
const express = require("express");
const app = express();
var cookieParser = require('cookie-parser');
const e = require("express");
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca",
              userID: "user_id"},
  "9sm5xK": {longURL:"http://www.google.com",
              userID: "user_id"      }
};



const users = {}

function getUserId(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user].id
    }
  }
}

function checkUserEmail(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return true
    }
  }
  return false
}

function checkUserPassword(password, users){
  for (const user in users) {
    if (users[user].password === password) {
      return true
    }
  }
  return false
}


function urlsForUser(id) {
  let userURLs = {};
  for (let urlKey in urlDatabase) {
    if ( id === urlDatabase[urlKey].userID) {
      userURLs[urlKey] = urlDatabase[urlKey];
    }
  }
  return userURLs;
}



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello!");
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
  const id = req.cookies.user_id  
  if(!id){
    return res.send("<a href='/login'> PLEASE LOGIN </a>")
  };
  const user = users[id]
  const templateVars = { urls: urlsForUser(id), user: user };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  const id = req.cookies["user_id"]  
  if(id){
    return res.redirect("/urls")
  };
  console.log(id, "login cookie id")
  const user = users[id]
  const templateVars = { urls: urlDatabase, user: user };
  res.render("login", templateVars);

});

app.get("/urls/new", (req, res) => {
  const id = req.cookies["user_id"]
  if(!id){
    return res.redirect("/login")
  };
  const user = users[id]
  const templateVars = { user: user }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.cookies.user_id
  if(!id){
    return res.send("not logged in")
  }
  if(!urlDatabase[req.params.id]){
    return res.send("not a valid short ID")
  }
  const user = users[id]
  if(urlDatabase[req.params.id].userID !== id){
     return res.send("error message")
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  const userID = req.cookies.user_id
  if(!urlDatabase[id].longURL){
    return res.send("not a valid short ID")
  }
  if(!userID){
    return res.send("please log in to view urls!")
  };
  const longURL = urlDatabase[id].longURL
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const id = req.cookies["user_id"]
  if(id){
    return res.redirect("/urls")
  };
  const user = users[id]
  const templateVars = { user: user }
  res.render('registration', templateVars)
});

app.post("/urls", (req, res) => {
  const userID = req.cookies["user_id"]
  if(!userID){
    return res.send("<a href='/login'> PLEASE LOGIN </a>")
  };
  const id = generateRandomString();
  const value = req.body.longURL
  urlDatabase[id] = {}
  urlDatabase[id].longURL = value
  urlDatabase[id].userID = userID
  res.redirect(`/urls/${id}`)
});

app.post("/urls/:id/delete", (req, res) => {
  const cookieid = req.cookies.user_id
  if(!cookieid){
    return res.send("not logged in")
  }
  const id = req.params.id
  if(!urlDatabase[id]){
    return res.send("not a valid short ID")
  }
  
  if(urlDatabase[req.params.id].userID !== cookieid){
    return res.send("error message")
 }
  delete urlDatabase[id]
  res.redirect(`/urls`)
});

app.post("/urls/:id", (req, res) => {
  const cookieid = req.cookies.user_id
  if(!cookieid){
    return res.send("not logged in")
  }
  const id = req.params.id
  if(!urlDatabase[id]){
    return res.send("not a valid short ID")
  }
  
  
  if(urlDatabase[req.params.id].userID !== cookieid){
    return res.send("error message")
 }

  urlDatabase[id].longURL = req.body.newUrl
  res.redirect(`/urls`)
});

app.post("/login", (req, res) => {
  console.log(req.body, "login reqbody"); // Log the POST request body to the console

  if (!checkUserEmail(req.body.email,users)) {
  res.status(403).send('PLEASE REGISTER UR BREAKING MY CODE')
  } 

  if(!checkUserPassword(req.body.password, users)){
    res.status(403).send('PLEASE CHECK YOUR PASSWORD :D') 
  } 

  if(checkUserEmail && checkUserPassword) {
  const user_id = getUserId(req.body.email, users)
  res.cookie("user_id", user_id)
  res.redirect("/urls")
  }
  

});


app.post("/logout", (req, res) => {
  console.log(req.body, "logout"); // Log the POST request body to the console
  res.clearCookie("user_id")
  res.redirect("/login")
});


app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).send('Bad Request')
  }
  for (const user in users) {
    if (users[user].email === req.body.email) { //for in loops for objects + [] for varibles `${user}`
      return res.status(400).send('email already taken')
    }
  }
  const id = generateRandomString();
  users[id] = {
    id: id,
    email: req.body.email,
    password: req.body.password,

  }
  console.log(users)
  res.cookie("user_id", id)
  res.redirect("/urls")
});


