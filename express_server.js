const { getUserID, userURLs, checkEmail, generateRandomString } = require('./helpers.js');
const express = require("express");
const app = express();
app.set('view engine', 'ejs');
const PORT = 8080; // default port 8080

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const bcrypt = require('bcryptjs');

//OBJECT OF URLS
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "pontiacbandit"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
  },

};

//OBJECT OF USERS
let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("funk", 10)
  },
  "pontiacbandit": {
    id: "pontiacbandit",
    email: "pontiac@bandit.com",
    password: bcrypt.hashSync("jakeperalta", 10)
  }
};

//GETS SERVER LISTENING
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); //gets our server ready to listen for requests and to process them



//RENDER ROOT PAGE
app.get('/', (req, res) => {
  const templateVars = {
    userId: req.session.userID,
    urls: userURLs(req.session.userID.id, urlDatabase)
  };
  if (!templateVars.userId) { //if there is no userId
    res.redirect('/login');
  }
  res.redirect('/urls');
  res.render('urls_index', templateVars); //'urls_index' is the name of the template we are passing our templateVars object to
});

//RENDER URLS/ROOT PAGE
app.get('/urls', (req, res) => {
  let templateVars = {
    userId: req.session.userID,
  };
  if (!templateVars.userId) { //if there is no userId - was getting an error if the userUrls function was inside templateVars at the top of the function defintion (cannot read .id of undefined - when there was no user logged in), so had to move it so if it passes the conditional for if a user is logged in then templateVars includes the userURLs function, if not then it doesn't and the error won't fire
    res.redirect('/login');//401 unauthorized
  }
  templateVars = { userId: req.session.userID, urls: userURLs(req.session.userID.id, urlDatabase) };
  res.render('urls_index', templateVars); //'urls_index' is the name of the template we are passing our templateVars object to
});

//RENDER NEW URL PAGE
app.get('/urls/new', (req, res) => {
  const templateVars = {
    userId: req.session.userID
  };
  if (!templateVars.userId) { //if there is no userId
    res.redirect('/login');
  }
  res.render('urls_new', templateVars); //takes user to Create TinyURL page
});

//USER ACCESS SHORT URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, //using the shortURL
    longURL: urlDatabase[req.params.shortURL].longURL,
    userId: req.session.userID
  };
  if (!templateVars.userId) { //if there is no userId
    return res.send('Must be logged in to be able to see URLs').status(401); //redirect user because they have to be logged in or have an account to use the functions
  }
  if (urlDatabase[templateVars.shortURL] === undefined) { //if url does not exist
    console.log("User tried inputting invalid Short URL"); //lets server know too
    return res.send("Invalid Short URL").status(400); //then tells the user and they can go back and try again
  } //otherwise things go ahead as per usual - it will pass if :shortURL exists in urldatabase and will continue correctly

  if (!req.session.userID.id === urlDatabase[templateVars.shortURL].userID) {
    return res.send("Sorry, you do not have access to this URL").status(401);
  }
  res.render("urls_show", templateVars); //passes both to urls_show template and then sends the HTML to the browser
});

app.post('/urls/:shortURL', (req, res) => {
  if (!req.session.userID) {
    return res.status(404).send();
  } else if (urlDatabase[req.params].userID !== req.session.userID) {
    return res.status(404).send();
  }
  res.redirect('/urls/:shortURL');
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    if (longURL === undefined) {
      return res.send("Short URL does not exist").status(404);
    }
    res.redirect(longURL);
  }
});


//JSON OF URLS
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); //if user types in urls.json then they will land on a page that gives them the URLS in the database in a JSON format
});


// ADD NEW URL
app.post("/urls", (req, res) => {
  const templateVars = {
    userId: req.session.userID
  };
  if (!templateVars.userId) { //if there is no userId
    return res.send('Must be logged in to be able to ADD a new URL').status(400); //redirect user because they have to be logged in or have an account to use the functions
  }
  if (req.body.longURL === undefined) {
    return res.send('No URL Input');
  }
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID.id,
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${newShortURL}`);
});

//DELETE URL
app.post('/urls/:shortURL/delete', (req,res) => {
  const templateVars = {
    shortURL: req.params.shortURL, //using the shortURL
    longURL: urlDatabase[req.params.shortURL].longURL,
    userId: req.session.userID
  };
  if (!templateVars.userId) { //if there is no userId
    return res.send('Must be logged in to be able to DELETE a URL').status(400); //redirect user because they have to be logged in or have an account to use the functions
  }
  if (urlDatabase[req.params.shortURL].userID !== req.session.userID.id) { //if user does not own URL
    return res.send("You do not have access to that URL").status(400);
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//UPDATE/EDIT URL
app.post('/urls/:shortURL/update', (req, res) => {
  const templateVars = {
    userId: req.session.userID
  };
  if (!templateVars.userId) { //if there is no userId
    return res.send('Must be logged in to be able to edit or update URL').status(400); //redirect user because they have to be logged in or have an account to use the functions
  }
  const updatedLongURL = req.body.longURL; //set a variable so it's easier
  if (urlDatabase[req.params.shortURL].userID !== req.session.userID.id) { //if user does not own URL
    return res.send("You do not have access to that URL").status(400);
  }
  if (urlDatabase[req.params.shortURL].userID === req.session.userID.id)
    urlDatabase[req.params.shortURL].longURL = updatedLongURL; //longURL in the database now equals the updated URL
  console.log("Updated URL"); //lets server-side know that a URL was updated successfully
  res.redirect('/urls');
});

//LOGIN PAGE
app.get('/login', (req, res) => {
  const templateVars = {
    userId: req.session.userID
  };
  res.render('urls_login', templateVars); //takes user to Create TinyURL page
});

//LOGIN FUNCTION
app.post('/login', (req, res) => {
  if (!req.body.password || !req.body.email) {//if the email and/or password fields are left empty
    return res.send("Email and/or Password fields left empty").status(400); //error code and let the user know
  }
  if (!checkEmail(users, req.body.email)) { //if the function checkEmail returns false then that means that the email is not registered
    return res.send("Oops! Looks like that email is not associated with an account").status(403); //error code and let the user know
  }
  if (checkEmail(users, req.body.email)) { //if the function checkEmail returns true then that means that the email is already registered
    const userID = getUserID(users, req.body.email);
    console.log(userID.password);
    if (!bcrypt.compareSync(req.body.password, userID.password)) { //if checkPassword fails then it means the user input the wrong password
      return res.send("Oops! Wrong Password").status(403);
    }
    req.session.userID = userID;
    console.log(req.session.userID);
    res.redirect('/urls');
  }
});

//LOGOUT FUNCTION
app.post('/logout', (req, res) => { //clears the corresponding user's cookie
  req.session = null;
  res.redirect('/login');
});

//RENDERS REGISTER PAGE
app.get('/register', (req, res) => { //renders our register page with the header
  const templateVars = {
    userId: req.session.userID
  };
  res.render('urls_register', templateVars);
});

//REGISTER FUNCTION
app.post('/register', (req, res) => {
  const randomUserID = generateRandomString(); //creates random ID
  const userPassword = req.body.password; //variable for their password
  const userEmail = req.body.email; //variable for email
  if (!userPassword || !userEmail) {//if the email and/or password fields are left empty
    return res.send("Email and/or Password fields left empty").status(400); //error code and let the user know
  }
  if (checkEmail(users, userEmail)) { //if the function checkEmail returns true then that means that the email is already registered
    return res.send("Oops! It looks like you're already registered").status(400); //error code and let the user know
  }
  //otherwise go ahead and register them
  users[randomUserID] = {
    "id": randomUserID,
    "email": userEmail,
    "password": bcrypt.hashSync(userPassword, 10)
  };
  console.log(users[randomUserID]); //console.logs the database of users just so we can check that it is working properly
  req.session.userID = users[randomUserID];
  res.redirect('/urls'); //redirect the user
});