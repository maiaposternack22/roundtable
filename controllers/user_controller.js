const express = require('express');
router = express.Router();
const allUserStuff = require('../models/user_model');


function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/');
  }
}

router.get('/wallet', loggedIn, function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("wallet",  {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email)

  });
});

router.get('/account', loggedIn, function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("accountSettings" ,{
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email)

  });
});

router.post('/account', loggedIn, function(request, response) {
let name = request.body.acct_name;
let username = request.body.acct_user;
let picture;
if((request.body.acct_picture) !== ""){
  picture = (request.body.acct_picture)
}
else{
  picture = allUserStuff.getAUser(request.user._json.email).image;

}
allUserStuff.updateUser(request.user._json.email, name, username, picture);
response.redirect('/account');
});

module.exports = router;
