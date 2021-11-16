# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of User Registration Page"](https://github.com/CrumpetsNTea/tinyapp/blob/master/docs/registration_page.png?raw=true)

!["Screenshot of Login Page"](https://github.com/CrumpetsNTea/tinyapp/blob/master/docs/login_page.png?raw=true)

!["Screenshot of the Main URLs Page While Logged In"](https://github.com/CrumpetsNTea/tinyapp/blob/master/docs/main_urls_page_logged_in.png?raw=true)

!["Screenshot of the Create a Tiny URL Page"](https://github.com/CrumpetsNTea/tinyapp/blob/master/docs/create_tiny_url_page.png?raw=true)

!["Screenshot of the URL Editor Page"](https://github.com/CrumpetsNTea/tinyapp/blob/master/docs/url_editor_page.png?raw=true)

!["Screenshot of the URLs Page After Adding A New URL"](https://github.com/CrumpetsNTea/tinyapp/blob/master/docs/urls_page_after_adding_new_url.png?raw=true)

## Features
  - Cookie Encryption
  - Secure Passwords
  - Working Registration Functionality Using Encrypted Cookies and Passwords
  - Working Login Functionality Using Encrypted Cookies and Passwords
  - Ability to add URLs and have them stored in the user's URLs object
        - When a user adds a URL it is stored in their accessible URLs
  - Ability to delete URLs and remove them from the user's URLs
  - Only able to access URLs if user is registered or logged in - otherwise prompts them to register or login to their account
      - Returns relevant HTML message if user does not have access to URLs
      - Returns relevant HTML message if the URL that was requested does not exist
  - Ability to click on the shortURL or type the shortURL in the URL bar after /u/ and it will take the user to the associated longURL

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server (which uses nodemon) using the `npm start` command.