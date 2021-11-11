const express = require("express");
const app = express();
app.set('view engine', 'ejs');
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//HELPER FUNCTION TO CREATE RANDOM STINGS (USED IN SHORTURL AND USER ID'S)
const generateRandomString = () => {
  let result = Math.random().toString(36).substr(2, 6);
  //creates a string of 6 characters which are randomly selected from Base36
  return result;
};

//HELPER FUNCTION FOR CHECKING EMAIL IN DATABASE
const checkEmail = (users, email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};

//HELPER FUNCTION FOR CHECKING PASSWORD IN DATABASE
const checkPassword = (users, password) => {
  for (let user in users) {
    if (users[user].password === password) {
      return users[user];
    }
  }
};

//OBJECT OF URLS
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "pontiacbandit"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "pontiacbandit"
  },

};

//OBJECT OF USERS
let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "funk"
  },
  "Doug Judy": {
    id: "pontiacbandit",
    email: "pontiac@bandit.com",
    password: "jakeperalta"
  }
};

//GETS SERVER LISTENING
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); //gets our server ready to listen for requests and to process them



//RENDER ROOT PAGE
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    longURL: urlDatabase["longURL"],
    userId: req.cookies["user_id"]
  };
  res.render('urls_index', templateVars); //takes user to MyURLs page if they just have a slash after the url
});

//RENDER URLS PAGE
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userId: req.cookies["user_id"]
  };

  res.render('urls_index', templateVars); //'urls_index' is the name of the template we are passing our templateVars object to
});

//RENDER NEW URL PAGE
app.get('/urls/new', (req, res) => {
  const templateVars = {
    userId: req.cookies["user_id"]
  };
  if (!templateVars.userId) { //if there is no userId
    res.redirect('/login'); //redirect user because they have to be logged in or have an account to use the functions
  }
  res.render('urls_new', templateVars); //takes user to Create TinyURL page
});

//USER ACCESS SHORT URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, //using the shortURL
    longURL: urlDatabase[req.params.shortURL].longURL,
    userId: req.cookies["user_id"]
  };
  if (!templateVars.userId) { //if there is no userId
    res.send('Must be logged in to be able to EDIT a URL'); //redirect user because they have to be logged in or have an account to use the functions
  }
  if (urlDatabase[req.params.shortURL] === undefined) { //if url does not exist
    res.send("Invalid Short URL"); //then tells the user and they can go back and try again
    console.log("User tried inputting invalid Short URL"); //lets server know too
  } //otherwise things go ahead as per usual - it will pass if :shortURL exists in urldatabase and will continue correctly
  res.render("urls_show", templateVars); //passes both to urls_show template and then sends the HTML to the browser
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    if (longURL === undefined) {
      res.status(404).send("Short URL does not exist");
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
    userId: req.cookies["user_id"]
  };
  if (!templateVars.userId) { //if there is no userId
    res.send('Must be logged in to be able to ADD a new URL'); //redirect user because they have to be logged in or have an account to use the functions
  }
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {longURL: req.body.longURL, userID: req.cookies["user_id"].email};
  console.log(urlDatabase);
  res.redirect(`/urls/${newShortURL}`);
});

//DELETE URL
app.post('/urls/:shortURL/delete', (req,res) => {
  const templateVars = {
    userId: req.cookies["user_id"]
  };
  if (!templateVars.userId) { //if there is no userId
    res.send('Must be logged in to be able to DELETE a URL'); //redirect user because they have to be logged in or have an account to use the functions
  }
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]; //deletes the variable
  console.log(urlDatabase);
  res.redirect('/urls');
});

//UPDATE/EDIT URL
app.post('/urls/:shortURL/update', (req, res) => {
  const templateVars = {
    userId: req.cookies["user_id"]
  };
  if (!templateVars.userId) { //if there is no userId
    res.send('Must be logged in to be able to edit or update URL'); //redirect user because they have to be logged in or have an account to use the functions
  }
  const shortURL = req.params.shortURL; //set a variable for the shortURL so it's easier
  const updatedLongURL = req.body.longURL; //set a variable so it's easier
  urlDatabase[shortURL].longURL = updatedLongURL; //longURL in the database now equals the updated URL
  console.log("Updated URL"); //lets server-side know that a URL was updated successfully
  res.redirect('/urls');
});

//LOGIN PAGE
app.get('/login', (req, res) => {
  const templateVars = {
    userId: req.cookies["user_id"]
  };
  res.render('urls_login', templateVars); //takes user to Create TinyURL page
});

//LOGIN FUNCTION
app.post('/login', (req, res) => {
  const userInfo = {//object to hold these variables so they can be passed to the header upon successsful login to display user email
    userPassword: req.body.password,
    email: req.body.email
  };
  if (!userInfo.userPassword || !userInfo.email) {//if the email and/or password fields are left empty
    res.status(400).send("Email and/or Password fields left empty"); //error code and let the user know
  }
  if (!checkEmail(users, userInfo.email)) { //if the function checkEmail returns false then that means that the email is not registered
    res.status(403).send("Oops! Looks like that email is not associated with an account"); //error code and let the user know
  }
  if (checkEmail(users, userInfo.email)) { //if the function checkEmail returns true then that means that the email is already registered
    if (!checkPassword(users, userInfo.userPassword)) { //if checkPassword fails then it means the user input the wrong password
      res.status(403).send("Oops! Wrong Password");
    }
    res.cookie("user_id", userInfo);
    res.redirect('/urls');
  }
});

//LOGOUT FUNCTION
app.post('/logout', (req, res) => { //clears the corresponding user's cookie
  res.clearCookie("user_id");
  res.redirect('/');
});

//RENDERS REGISTER PAGE
app.get('/register', (req, res) => { //renders our register page with the header
  const templateVars = {
    userId: req.cookies["user_id"]
  };
  res.render('urls_register', templateVars);
});

//REGISTER FUNCTION
app.post('/register', (req, res) => {
  let randomUserID = generateRandomString(); //creates random ID
  const userPassword = req.body.password; //variable for their password
  const userEmail = req.body.email; //variable for email
  if (!userPassword || !userEmail) {//if the email and/or password fields are left empty
    res.status(400).send("Email and/or Password fields left empty"); //error code and let the user know
  }
  if (checkEmail(users, userEmail)) { //if the function checkEmail returns true then that means that the email is already registered
    res.status(400).send("Oops! It looks like you're already registered"); //error code and let the user know
  }
  //otherwise go ahead and register them
  users[randomUserID] = {
    "id": randomUserID,
    "email": userEmail,
    "password": userPassword
  };
  console.log(users); //console.logs the database of users just so we can check that it is working properly
  res.cookie("user_id", users[randomUserID]);
  res.redirect('/urls'); //redirect the user
});