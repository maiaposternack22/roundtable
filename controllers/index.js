//..............Include Express..................................//
const express = require('express');
router = express.Router();

const allUserStuff = require('../models/user_model');
const allEventStuff = require('../models/events_model');



function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/');
    }
}

router.get('/', function(request, response) {

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  if(request.user){
    if (allUserStuff.userExists(request.user._json.email) == false){
      allUserStuff.createNewUser(
        request.user._json.email,
        request.user._json.name,
        request.user._json.given_name,
        request.user._json.family_name,
        request.user._json.picture
      );
      allUserStuff.setCurrentUser =  allUserStuff.getAUser(request.user._json.email)
    }
    let eventArray = allUserStuff.getEvents(request.user._json.email)
    let currentE = allEventStuff.currentEvents(eventArray)
    let pastE = allEventStuff.pastEvents(eventArray)

    console.log("current", currentE, "past", pastE)
    response.render("index", {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email),
    currentEvents: currentE,
    pastEvents: pastE

  }); }
  else{
    response.render("not_logged", {
    user: request.user
    }); }

});


router.get('/error', function(request, response) {
  const errorCode = request.query.code;
  if (!errorCode) errorCode = 400;
  const errors = {
    '400': "Unknown Client Error",
    '401': "Invlaid Login",
    '404': "Resource Not Found",
    '500': "Server problem"
  }
  response.status(errorCode);
  response.setHeader('Content-Type', 'text/html')
  if(request.user){
  response.render("error", {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email),
    "errorCode": errorCode,
    "details": errors[errorCode]
  });
}else{
  response.render("error", {
    user: request.user,
    "errorCode": errorCode,
    "details": errors[errorCode]
  });

  }
});

module.exports = router
