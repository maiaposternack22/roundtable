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

router.get('/newEvent', loggedIn, function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("newEvent",  {
    user: request.user,
    currentUser:allUserStuff.getAUser(request.user._json.email),
    allOtherUsers: allUserStuff.getAllUsernames(allUserStuff.getAUser(request.user._json.email).username)

  });
});

router.post('/newEvent',loggedIn, function(request, response) {
  let name = request.body.eventName;
  let friends = [];
  friends.push(allUserStuff.getAUser(request.user._json.email).username)
  if (request.body.eventFriends){
  if(Array.isArray(request.body.eventFriends.length)){
  for(let i of request.body.eventFriends ){
  friends.push(i)}}
  else{
    friends.push(request.body.eventFriends)
  }}
  let picture = request.body.eventPicture;
  let id = allEventStuff.createNewEvent(name, friends,picture);
  allUserStuff.updateEventArrays(friends,id)
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.redirect('/event/'+id.toString()+'/active');

});


module.exports = router;
