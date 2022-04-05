const fs = require('fs');


exports.createNewTransaction =  function (eventId, user, username, desc, price, reciept){
let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
let myID = Math.floor(Math.random() * 1000000000000)

let newTrans = {
  "id": myID,
  "event_id": eventId,
  "user": user,
  "username": username,
  "desc": desc,
  "price": price,
  "receipt": reciept,
  "dispute" : ""
}
  trans[myID] = newTrans;
  fs.writeFileSync(__dirname+'/../data/transactions.json', JSON.stringify(trans));
  return myID
}

exports.getTransaction = function(id){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  return trans[id];
}

exports.getTransactionsArray = function(idArray){
  let trans = JSON.parse(fs.readFileSync(__dirname+'/../data/transactions.json'));
  let transArray = []
  for(let i of idArray){
    transArray.push(trans[i])
  }
  return(transArray)


}
