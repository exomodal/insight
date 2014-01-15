
Meteor.methods({
	/*
	 * Provide a function that can be invoked over the network by clients.
	 * This function removes an user.
	 */
	removeUser: function(id) {
		Meteor.users.remove({_id:id});
	},

	/*
 	 * Provide a function that can be invoked over the network by clients.
 	 * This function updates data of an user.
	 */
	updateUser: function(id, email, name, role, verified) {
		Meteor.users.update({_id:id}, {$set:{profile:{email:email, name:name, verified:verified}, roles:[role]}});
	},

	/*
 	 * Provide a function that can be invoked over the network by clients.
 	 * This function sets the password of an user.
	 */
	setPassword: function(id, password) {
		Accounts.setPassword(id, password);
	}
});

/*
 * Create the admin account on startup if not exist.
 */
Meteor.startup(function () {
	var isExisting = false;
	var cursor = Meteor.users.find();

	// Check whether the admin user already exists
	cursor.forEach(function (user) {
		if (user.profile !== undefined && user.profile.name !== undefined) {
			if (user.profile.name === "Admin User") {
				isExisting = true;
			}
		}
	});

	// Create Admin user if not exists
	if (!isExisting) {
		console.log('Creating user: admin@admin.com, password: admin');

		// Create account
	    id = Accounts.createUser({
	      email: "admin@admin.com",
	      password: "admin",
	      profile: { name: "Admin User", email: "admin@admin.com", verified: true }
	    });

	    // Set the role of the user
	    Meteor.users.update({_id:id}, {$set:{roles:['Admin']}});
  	}
});