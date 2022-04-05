const fs = require('fs');

exports.getAllUsers = function(){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return users;
}

exports.getAllUsernames= function(currentUser){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  let allNames = []
  for (let i in users){
    if(users[i].username.length > 0){
      if(users[i].username !== currentUser){
    allNames.push (users[i].username)
  }
  }}
  return(allNames)
}



exports.createNewUser =  function (userEmail, userName, userFirst, userLast, userImage){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  let newUser=
  {
    "email": userEmail,
    "full_name":userName,
    "first_name": userFirst,
    "last_name": userLast,
    "image": userImage,
    "username": userFirst+ Math.floor(Math.random() * 10000),
    "rating_data": [],
    "average_rating": "",
    "event_ids": []
  }
  users[userEmail] = newUser;
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));
}

exports.userExists = function(userEmail){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  if(users[userEmail]) return true;
  else return false;
}

exports.getAUser = function(userEmail){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return (users[userEmail])
}


exports.updateUser = function(userEmail,userFullName,userName, userPicture){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  users[userEmail]["full_name"] = userFullName;
  users[userEmail]["username"] = userName;
  users[userEmail]["image"] = userPicture;
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.verifyUser = function(username){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for (let i in users){
  if(name == users[i].username){
  return(true)
  }
  }
  return(false)

}

exports.updateEventArrays = function(friends,id){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for(let index in users){
    for(let bff of friends){
    if(users[index].username == bff){
      users[index].event_ids.push(id)
    }
  }
  }
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.updateEventArraysForString = function(friend,id){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  for(let index in users){
    if(users[index].username == friend){
      users[index].event_ids.push(parseInt(id))
    }
  }
  fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(users));

}

exports.getEvents = function(email){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  return (users[email].event_ids)

}

exports.getEmail = function(username){
  let users = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  for(let i in users){
    if(users[i].username == username){
      return(users[i].email)
    }
  }

}
