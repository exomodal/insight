// Editing row id
var ADMIN_EDIT_ID;

/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * Get all roles from the configuration.
 */
Template.adminPage.role = function () {
  var config = configuration.findOne();
  if (config !== undefined && config.roles !== undefined)
    return config.roles;
  return undefined;
}

/*
 * Get all users from the collection.
 */
Template.adminPage.user = function() {
	return Meteor.users.find();
}

/*
 * All other get functions for the template.
 */
Template.adminPage.getName = function(user) {
  return getName(user);
}
Template.adminPage.getAddress = function(user) {
	return getAddress(user);
}
Template.adminPage.getType = function(user) {
	return getType(user);
}
Template.adminPage.getVerified = function(user) {
	return getVerified(user);
}

/*****************************************************************************
 * General functions
 *****************************************************************************/

/*
 * Get the account type of the user.
 */
function getType(user) {
  if (user.services !== undefined) {
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
    if (user.profile.verified == true) {
      return "Ja";
    } else {
      return "Nee";
    }
  }
	return "Nee";
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
  $('#typeField').val('');
  $('#verifiedField').val('');

  // Set the password field and its placeholder
  var passwordField = document.getElementById("passwordField");
  if (passwordField !== null && passwordField !== undefined) {
    passwordField.disabled = true;
    passwordField.placeholder = '';
  }
}

/*****************************************************************************
 * Event functions
 *****************************************************************************/

Template.adminPage.events({
  /*
   * Executed when clicking the SAVE button
   */
  'click .saveButton':function(e) {
    // Get all input field values
    if (document.getElementById("verifiedField").value === "Ja") {
   		var verifiedVal = true;
   	} else {
   		var verifiedVal = false;
   	}
    var emailVal = document.getElementById("emailField").value;
    var nameVal = document.getElementById("nameField").value;
    var passwordVal = document.getElementById("passwordField").value;
    var typeVal = document.getElementById("typeField").value;
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
      if (passwordVal !== "" && typeVal === "Normal") {
        Meteor.call('setPassword', ADMIN_EDIT_ID, passwordVal, function (error, result) {
          // If error
          if (error) {
            throwError(error.reason);
          }
        });
      }
    } else {
      throwError("Selecteer eerst een account dat u wilt bewerken.");
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
  	$('#typeField').val(getType(this));
    $('#verifiedField').val(getVerified(this));
    
    // Set the password field enabled when the account type is Normal
    var passwordField = document.getElementById("passwordField");
    if (passwordField !== null && passwordField !== undefined) {
      if (getType(this) === "Normal") {
        passwordField.disabled = false;
        passwordField.placeholder = 'Ongewijzigd';
      } else {
        passwordField.disabled = true;
        passwordField.placeholder = '';
      }
    }
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
Template.adminPage.rendered=function() {
  // Initialize the input fields
  resetInputFields();
}