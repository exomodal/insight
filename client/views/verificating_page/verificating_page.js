/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * Get all roles from the configuration.
 */
Template.verificatingPage.role = function () {
	var config = configuration.findOne();
	if (config !== undefined && config.roles !== undefined)
		return config.roles;
	return undefined;
}

/*
 * Check whether the account is pending verification.
 * Returns true when pending else returns false.
 */
Template.verificatingPage.isPending = function() {
	// Get the logged in user
	var loggedInUser = Meteor.user();

	// Verify whether all fields are filled
	// If not all fields are filled the account is not pending verification
	if (getAddress(loggedInUser) === "") return false;
	if (getName(loggedInUser) === "") return false;
	if (getRole(loggedInUser) === "") return false;

	return true;
}

/*****************************************************************************
 * General functions
 *****************************************************************************/

/*
 * Get the account type of the user.
 */
function getType(user) {
	if (user !== null && user.services !== undefined) {
		if (user.services.facebook !== undefined) {
			return "Facebook";
		} else if (user.services.linkedin !== undefined) {
			return "Linkedin";
		} else if (user.services.twitter !== undefined) {
			return "Twitter";
		}
	}
	return "Normal";
}

/*
 * Get the email address of the user.
 */
function getAddress(user) {
	// Get the account type
	var type = getType(user);

	// If the user already filled his email address once
	// it will be located in the profile.
	if (user !== null && user.profile !== undefined && user.profile.email !== undefined) {
		return user.profile.email;

	// Else we display the email address from the services
	} else if (user !== null) {
		if (type === "Normal") {
			return user.emails[0].address;
		} else if (type === "Facebook") {
			return user.services.facebook.email;
		} else if (type === "Linkedin") {
			return user.services.linkedin.emailAddress;
		}
	}
	return "";
}

/*
 * Get the full name of the user.
 */
function getName(user) {
	// Get the account type
	var type = getType(user);

	// If the user already filled his name once
	// it will be located in the profile.
	if (user !== null && user.profile !== undefined && user.profile.name !== undefined) {
		return user.profile.name;
	
	// Else we display the name from the services
	} else if (user !== null) {
		// Only Facebook and Linkedin accounts does have a full name
		if (type === "Facebook") {
			return user.services.facebook.first_name + " " + user.services.facebook.first_name;
		} else if (type === "Linkedin") {
			return user.services.linkedin.firstName + " " + user.services.linkedin.lastName;
		}
	}
	return "";
}

/*
 * Get the role of the user.
 */
function getRole(user) {
	if (user !== null && user.roles !== undefined && user.roles[0] !== undefined)
		return user.roles[0];
	return "";
}

/*
 * Clear the input fields.
 */
function resetInputFields() {
	// Get the logged in user
	var loggedInUser = Meteor.user();

  	// Reset the input values
  	$('#emailField').val(getAddress(loggedInUser));
  	$('#nameField').val(getName(loggedInUser));
  	$("#roleField").val(getRole(loggedInUser));

  	// Set the email field disabled when it is already filled
  	var emailField = document.getElementById("emailField");
  	if (emailField !== null && emailField !== undefined) {
	  	if (emailField.value !== "") {
	  		emailField.disabled = true;
	  	} else {
	  		emailField.disabled = false;
	  	}
	}
}

/*****************************************************************************
 * Event functions
 *****************************************************************************/

Template.verificatingPage.events({
	/*
	 * Executed when clicking the Reset button
	 */
	'click .resetButton':function(e) {
		// Reset the input fields
		resetInputFields();
	},

	/*
	 * Executed when clicking the Save button
	 */
	'click .saveButton':function(e) {
		// Get the logged in user
		var loggedInUser = Meteor.user();

		// Get all input field values
	    var emailVal = document.getElementById("emailField").value;
	    var nameVal = document.getElementById("nameField").value;
	    var roleVal = document.getElementById("roleField").value;

	    // Check if all fields are filled
	    if (emailVal === "" || nameVal === "" || roleVal === "") {
	    	throwError("All required fields have to be filled in.");
	    } else {
	    	Meteor.call('updateUser', loggedInUser._id, emailVal, nameVal, roleVal, false, function (error, result) {
			   	if (error) {
			   		throwError(error.reason);
			   	} else {
			   		// Clear the input fields
			   		resetInputFields();
			   	}
		  	});
	    }
	}
});

/*****************************************************************************
 * Rendered function
 *****************************************************************************/

/**
 * Template rendering function
 */
Template.verificatingPage.rendered=function() {
	// Initialize the input fields
	resetInputFields();
}