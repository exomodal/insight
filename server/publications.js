Meteor.publish('configuration', function (){ 
    return Configuration.find();
});

Meteor.publish('management', function (){ 
    return Management.find();
});

Meteor.publish('terminalmanager', function (){ 
    return TerminalManager.find();
});

Meteor.publish('truckplanning', function (){ 
    return Truckplanning.find();
});

Meteor.publish('intermodalplanning', function (){ 
    return Intermodalplanning.find();
});

Meteor.publish('customerservice', function (){ 
    return Customerservice.find();
});

Meteor.publish('users', function (user){
  if (user === null) {
    return Meteor.users.find({_id:"none"});
  } else if (user === undefined) {
  	return Meteor.users.find();
  } else if (user) {
    return Meteor.users.find({_id:user._id});
  }
  return Meteor.users.find({_id:"none"});
});