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
    if (users[user].email === email)
      return users[user];
  }
};

//OBJECT OF URLS
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  res.render('urls_new', templateVars); //takes user to Create TinyURL page
});

//USER ACCESS SHORT URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, //using the shortURL
    longURL: urlDatabase[req.params.shortURL],
    userId: req.cookies["user_id"]
  }; //looks up the corresponding longURL
  if (urlDatabase[req.params.shortURL] === undefined) { //if url does not exist
    res.send("Invalid Short URL"); //then tells the user and they can go back and try again
    console.log("User tried inputting invalid Short URL"); //lets server know too
  } //otherwise things go ahead as per usual - it will pass if :shortURL exists in urldatabase and will continue correctly
  res.render("urls_show", templateVars); //passes both to urls_show template and then sends the HTML to the browser
});

app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  let longURL = urlDatabase[short]; //if they click on the new shortURL
  res.redirect(longURL); //then will redirect them to the website of the shortURL using shortURL as a key to access the value which is the longURL
});


//JSON OF URLS
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); //if user types in urls.json then they will land on a page that gives them the URLS in the database in a JSON format
});



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

//UPDATE/EDIT URL
app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL; //set a variable for the shortURL so it's easier
  const updatedLongURL = req.body.longURL; //set a variable so it's easier
  urlDatabase[shortURL] = updatedLongURL; //longURL in the database now equals the updated URL
  console.log("Updated URL");
  res.redirect('/urls');
});

//SET COOKIE TO SAVE INPUT USERNAME
app.post('/login', (req, res) => {
  let randomUserID = generateRandomString(); //creates random ID
  const userPassword = req.body.password; //variable for their password
  const userEmail = req.body.email; //variable for email
  users[randomUserID] = {
    "id": randomUserID,
    "email": userEmail,
    "password": userPassword
  };
  res.cookie("user_id", users[randomUserID]);
  res.redirect('/');
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
  console.log(users);
  res.cookie("user_id", users);
  res.redirect('/urls'); //redirect the user
});