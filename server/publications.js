Meteor.publish('configuration', function (){ 
    return configuration.find();
});

Meteor.publish('users', function (){ 
  	return Meteor.users.find();
});