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
      return true;
    }
  }
  return false;
};

//HELPER FUNCTION FOR USERS ONLY BEING ABLE TO SEE URLS TIED TO THEIR ACCOUNT
const userURLs = function(id, urlDatabase) {
  const userURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};

//HELPER FUNCTION GET USER NAME BY EMAIL - CAN USE IN LOGIN
const getUserID = function(users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
};

module.exports = { getUserID, userURLs, checkEmail, generateRandomString };