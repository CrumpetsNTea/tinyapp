const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const generateRandomString = () => {
  let result = Math.random().toString(36).substr(2, 6);
  //creates a string of 6 characters which are randomly selected from Base36
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars); //'urls_index' is the name of the template we are passing our templateVars object to
});

app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars); //takes user to MyURLs page if they just have a slash after the url
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new'); //takes user to Create TinyURL page
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, //using the shortURL
    longURL: urlDatabase[req.params.shortURL] }; //looks up the corresponding longURL
  res.render("urls_show", templateVars); //passes both to urls_show template and then sends the HTML to the browser
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); //if user types in urls.json then they will land on a page that gives them the URLS in the database in a JSON format
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); //gets our server ready to listen for requests and to process them

app.post("/urls", (req, res) => {
  let newRandomShortURL = generateRandomString(); //makes a random short url to pair with the user input long url
  urlDatabase[newRandomShortURL] = req.body.longURL; //adds long and short URL of user input to the urlDatabase
  console.log(req.body);  // Log the POST request body (longURL) to the console
  res.redirect(`/urls/${newRandomShortURL}`);//redirects user to the newly generated shortURLs page
  console.log(urlDatabase); //logs the updated urlDatabase to the console
});