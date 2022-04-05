const express = require('express');
router = express.Router();
const allUserStuff = require('../models/user_model');
const allEventStuff = require('../models/events_model');
const allTransStuff = require('../models/transactions_model');

const calculate = require('../models/calculations');

const emailFunctions = require('../models/email');


function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/');
  }
}

router.get('/event/:id/active', loggedIn,function(request, response) {
  console.log("redirected")
  let id = request.params.id;
  let transIds = allEventStuff.getTrans(id);
  console.log("trans",transIds)
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("event",  {
    user: request.user,
    currentUser: allUserStuff.getAUser(request.user._json.email),
    event: allEventStuff.getAnEvent(id),
    trans: allTransStuff.getTransactionsArray(transIds),
    allOtherUsers: allUserStuff.getAllUsernames(allUserStuff.getAUser(request.user._json.email).username)

  });
});

router.get('/event/:id/past', loggedIn,function(request, response) {
  let id = request.params.id;
  let email = ""
  let user = allUserStuff.getAUser(request.user._json.email)
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("completed",  {
    user: request.user,
    currentUser: user,
    event: allEventStuff.getAnEvent(id),
    dues: calculate.getDues(id),
    email: email

  });
});

router.get('/event/:id/past/emailConfirmed', loggedIn,function(request, response) {
  let id = request.params.id;
  let email = "Your Reminder Email Was Sent Successfully!"
  let user = allUserStuff.getAUser(request.user._json.email)
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("completed",  {
    user: request.user,
    currentUser: user,
    event: allEventStuff.getAnEvent(id),
    dues: calculate.getDues(id),
    email: email

  });
});


router.get('/eventDues/:id', loggedIn,function(request, response) {
  let id = request.params.id;
  let transIds = allEventStuff.getTrans(id);
  let transArray = allTransStuff.getTransactionsArray(transIds);
  let eventInfo = allEventStuff.getAnEvent(id);
  let eachTotal = calculate.getEachTotal(transArray,id,eventInfo)
  let eachOwes = calculate.eachOwes(eachTotal)
  calculate.setFinalAmounts(eachOwes,id);
  allEventStuff.completeEvent(id);
  console.log("justSaved")
  response.redirect('/event/'+id+'/past');

});

router.get('/paid/:id', loggedIn,function(request, response) {
  let id = request.params.id;
let user = allUserStuff.getAUser(request.user._json.email).username
  calculate.userPaid(id,user);

  response.redirect('/event/'+id+'/past');

});

router.post('/email', loggedIn,function(request, response) {
  let username = request.body.who;
  let id = request.body.id;
  let current = request.body.current;
  let amount = request.body.amount
  let name = allEventStuff.getAnEvent(id)["name"];
  console.log(id, current, amount, username,name)
  let email = allUserStuff.getEmail(username);
  emailFunctions.sendReminder(username,email,id,current,amount,name);
  console.log(email)
  response.redirect('/event/'+id+'/past/emailConfirmed');

});



router.post('/join', loggedIn, function(request, response) {
let id = allEventStuff.searchForCode(request.body.eventCode)
let user = allUserStuff.getAUser(request.user._json.email).username;
if(allEventStuff.alreadyThere(id,user) == false){

  allEventStuff.addJoinedPerson(id,user)
  allUserStuff.updateEventArraysForString(user,id)

}

if(id == "0"){
  response.redirect('/error?code=404');
  console.log(request.body.eventCode)
}
else{
  response.redirect('/event/'+id+'/active');

}
});

router.post('/addFriend', loggedIn, function(request, response) {
  let user = request.body.friend_name;
  let id = request.body.id;
  if(allUserStuff.verifyUser){
  allEventStuff.addUser(id,user)}
  allUserStuff.updateEventArraysForString(user,id)
  response.redirect('/event/'+id+'/active');
});

router.post('/newTransaction', loggedIn, function(request, response) {
  let desc = request.body.purchase_desc;
  let price = request.body.purchase_price;
  let reciept = request.body.purchase_reciept;
  let user = request.user._json.email;
  let username = allUserStuff.getAUser(request.user._json.email).username
  let eventId = request.body.id;
  let transId = allTransStuff.createNewTransaction(eventId, user, username, desc, price, reciept)
  allEventStuff.addTransaction(transId,eventId)
  allEventStuff.addTransTotal(price,eventId)
  console.log(allTransStuff.getTransaction(transId))
  console.log(allEventStuff.getAnEvent(eventId))
  response.redirect('/event/'+eventId+'/active');
});




module.exports = router;
