Meteor.publish('configuration', function (){ 
    return Configuration.find();
});

Meteor.publish('management', function (){ 
    return Management.find();
});

Meteor.publish('users', function (user){
  if (user === undefined) {
  	return Meteor.users.find();
  } else if (user) {
    return Meteor.users.find({_id:user._id});
  }
  return undefined;
});