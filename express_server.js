const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//USED TO CREATE NEW SHORTURL
const generateRandomString = () => {
  let result = Math.random().toString(36).substr(2, 6);
  //creates a string of 6 characters which are randomly selected from Base36
  return result;
};

//DATABASE OF URLS
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


//URLS PAGE
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render('urls_index', templateVars); //'urls_index' is the name of the template we are passing our templateVars object to
});

//ROOT PAGE
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('urls_index', templateVars); //takes user to MyURLs page if they just have a slash after the url
});

//NEW URL PAGE
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render('urls_new', templateVars); //takes user to Create TinyURL page
});

//USER ACCESS SHORT URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, //using the shortURL
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  }; //looks up the corresponding longURL
  if (urlDatabase[req.params.shortURL] === undefined) { //if url does not exist
    res.send("Invalid Short URL"); //then tells the user and they can go back and try again
    console.log("User tried inputting invalid Short URL"); //lets server know too
  } //otherwise things go ahead as per usual - it will pass if :shortURL exists in urldatabase and will continue correctly
  res.render("urls_show", templateVars); //passes both to urls_show template and then sends the HTML to the browser
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); //if user types in urls.json then they will land on a page that gives them the URLS in the database in a JSON format
});

//GETS SERVER LISTENING
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); //gets our server ready to listen for requests and to process them

// ADD NEW URL
app.post("/urls", (req, res) => {
  let newRandomShortURL = generateRandomString(); //makes a random short url to pair with the user input long url
  urlDatabase[newRandomShortURL] = req.body.longURL; //adds long and short URL of user input to the urlDatabase
  console.log(req.body);  // Log the POST request body (longURL) to the console
  res.redirect(`/urls/${newRandomShortURL}`);//redirects user to the newly generated shortURLs page
  console.log(urlDatabase); //logs the updated urlDatabase to the console
});

//DELETE URL
app.post('/urls/:shortURL/delete', (req,res) => {
  
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]; //deletes the variable
  res.redirect('/urls');
});

//UPDATE EDIT URL
app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL; //set a variable for the shortURL so it's easier
  const updatedLongURL = req.body.longURL; //set a variable so it's easier
  urlDatabase[shortURL] = updatedLongURL; //longURL in the database now equals the updated URL
  res.redirect('/urls');
});

//SET COOKIE TO SAVE INPUT USERNAME
app.post('/login', (req, res) => {
//set cookie = req.body
//redirect to urls page
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect('urls');
});

app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  let longURL = urlDatabase[short]; //if they click on the new shortURL
  res.redirect(longURL); //then will redirect them to the website of the shortURL using shortURL as a key to access the value which is the longURL
});