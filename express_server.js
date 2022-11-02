function generateRandomString() {
  var result           = '';
    var characters       = 'A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i <= 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

console.log(generateRandomString())


const { request } = require("express");
const express = require("express");
const app = express();
var cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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
  const templateVars = { urls: urlDatabase, username:req.cookies["name"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["name"]}
  res.render("urls_new",templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["name"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
   const id = generateRandomString();
   const value = req.body.longURL
   urlDatabase[id] = value  
   res.redirect(`/urls/${id}`)
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = req.params.id
  delete urlDatabase[id]
  res.redirect(`/urls`)
});

app.post("/urls/:id", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = req.params.id
  urlDatabase[id] = req.body.newUrl
  res.redirect(`/urls`)
});

app.post("/login", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
 res.cookie("name", req.body.username)
 res.redirect("/urls")
});


app.post("/logout", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
 res.clearCookie("name", req.body.username)
 res.redirect("/urls")
});


