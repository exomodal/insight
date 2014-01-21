/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * Get all roles from the configuration.
 */
Template.verificating.role = function () {
	var config = Configuration.findOne();
	if (config !== undefined && config.roles !== undefined)
		return config.roles;
	return undefined;
}

/*
 * Check whether the account is pending verification.
 * Returns true when pending else returns false.
 */
Template.verificating.isPending = function() {
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
 * Get the email address of the user.
 */
function getAddress(user) {
	// If the user already filled his email address once
	// it will be located in the profile.
	if (user !== null && user.profile !== undefined && user.profile.email !== undefined) {
		return user.profile.email;

	// Else we display the email address from the services
	} else if (user !== null) {
		return user.emails[0].address;
	}
	return "";
}

/*
 * Get the full name of the user.
 */
function getName(user) {
	// If the user already filled his name once
	// it will be located in the profile.
	if (user !== null && user.profile !== undefined && user.profile.name !== undefined) 
		return user.profile.name;
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

Template.verificating.events({
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
Template.verificating.rendered=function() {
	// Initialize the input fields
	resetInputFields();
}