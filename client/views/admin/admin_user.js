// Editing row id
var ADMIN_EDIT_ID;

/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * Get all roles from the configuration.
 */
Template.adminUser.role = function () {
  var config = Configuration.findOne();
  if (config !== undefined && config.roles !== undefined)
    return config.roles;
  return undefined;
}

/*
 * Get all users from the collection.
 */
Template.adminUser.user = function() {
	return Meteor.users.find();
}

/*
 * All other get functions for the template.
 */
Template.adminUser.getName = function(user) {
  return getName(user);
}
Template.adminUser.getAddress = function(user) {
	return getAddress(user);
}
Template.adminUser.getVerified = function(user) {
	return getVerified(user);
}

/*****************************************************************************
 * General functions
 *****************************************************************************/

/*
 * Get the full name of the user.
 */
function getName(user) {
  if (user.profile !== undefined && user.profile.name !== undefined)
    return user.profile.name;
  return "";
}

/*
 * Get the email address of the user.
 */
function getAddress(user) {
	if (user.profile !== undefined && user.profile.email !== undefined)
    return user.profile.email;
	return "";
}

/*
 * Check whether the user is verified.
 */
function getVerified(user) {
	if (user.profile !== undefined && user.profile.verified !== undefined) {
    if (user.profile.verified == true)
      return "Yes";
  }
	return "No";
}

/*
 * Reset the edit_id and clear the input fields.
 */
function resetInputFields() {
  // Reset edit_id
  ADMIN_EDIT_ID = undefined;

  // Reset the input values
  $('#emailField').val('');
  $('#nameField').val('');
  $('#passwordField').val('');
  $('#roleField').val('');
  $('#verifiedField').val('');

  // Set the password field placeholder
  passwordField.placeholder = '';
}

/*****************************************************************************
 * Event functions
 *****************************************************************************/

Template.adminUser.events({
  /*
   * Executed when clicking the SAVE button
   */
  'click .saveButton':function(e) {
    // Get all input field values
    if (document.getElementById("verifiedField").value === "Yes") {
   		var verifiedVal = true;
   	} else {
   		var verifiedVal = false;
   	}
    var emailVal = document.getElementById("emailField").value;
    var nameVal = document.getElementById("nameField").value;
    var passwordVal = document.getElementById("passwordField").value;
    var roleVal = document.getElementById("roleField").value;

    // If undefined we do an insert
    if (ADMIN_EDIT_ID !== undefined) {
      // Update the account
      Meteor.call('updateUser', ADMIN_EDIT_ID, emailVal, nameVal, roleVal, verifiedVal, function (error, result) {
      	// If error
      	if (error) {
        	throwError(error.reason);
        }
   		});
      // Update the password when necessary
      if (passwordVal !== "") {
        Meteor.call('setPassword', ADMIN_EDIT_ID, passwordVal, function (error, result) {
          // If error
          if (error) {
            throwError(error.reason);
          }
        });
      }
    } else {
      throwError("Please select an account first.");
    }
    // Reset edit_id and clear input fields
    resetInputFields();
  },

  /*
   * Executed when clicking the CANCEL button
   */
  'click .cancelButton':function(e) {
    // Reset edit_id and clear input fields
    resetInputFields();
  },

  /*
   * Executed when clicking the EDIT button
   */
  'click .editButton':function(e) {
    // Reset edit_id
  	ADMIN_EDIT_ID = this._id;

  	// Reset the input values
  	$('#emailField').val(getAddress(this));
  	$('#nameField').val(getName(this));
  	$('#roleField').val(this.roles);
    $('#verifiedField').val(getVerified(this));
    
    // Set the password field placeholder
    passwordField.placeholder = 'Unmodified';
  },

  /*
   * Executed when clicking the REMOVE button.
   * The remove modal will be opened already.
   */
  'click .removeButton':function(e) {
    // Set the edit_id
    ADMIN_EDIT_ID = this._id;
  },

  /*
   * Executed when clicking the OK button inside the modal
   */
  'click .removeOkButton':function(e) {
    // Remove the row from the collection
    Meteor.call('removeUser', ADMIN_EDIT_ID, function (error, result) {
      	// If error
      	if (error) {
        	throwError(error.reason);
   		}
   	});

    // Reset edit_id and clear input fields
    resetInputFields();

    // Hide the modal
    $('#removeDialog').modal('hide');
  },

  /*
   * Executed when clicking the CANCEL button inside the modal
   */
  'click .removeCancelButton':function(e) {
  	// Reset edit_id and clear input fields
    resetInputFields();

    // Hide the modal
    $('#removeDialog').modal('hide');
  }
});

/*****************************************************************************
 * Rendered function
 *****************************************************************************/

/**
 * Template rendering function
 */
Template.adminUser.rendered=function() {
  // Initialize the input fields
  resetInputFields();
}