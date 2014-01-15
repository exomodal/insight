configuration = new Meteor.Collection("Configuration");

/*
 * The code below makes sure a loggedin user is allowed to
 * insert and remove records in the collection.
 * This code is added as example, no user is allowed to do this 
 * in the Configuration collection.
 */

 /*
configuration.allow({
	insert: function(userId, doc) {
		// only allow posting if you are logged in
		return !! userId;
	},
	remove: function(userId, doc) {
		// only allow posting if you are logged in
		return !! userId;
	},
	update: function(userId, doc) {
		// only allow posting if you are logged in
		return !! userId;
	}
});
configuration.deny({
	insert: function(userId, doc) {
	
	},
	remove: function(userId, doc) {
	
	},
	update: function(userId, doc) {
	
	}
});
*/