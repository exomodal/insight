// Variable declarations
var FORM_ID;

/*****************************************************************************
 * General Template functions
 *****************************************************************************/

/*
 * This function sets the form id variable based on the URL.
 */
Template.dataentry.initialize = function () {
	if (this && this[0]) {
    FORM_ID = Number(this[0]);
  } else {
    FORM_ID = -1;
  }
}

/*
 * Get the form label
 */
Template.dataentry.formlabel = function () {
  var form = getForm();
  if (form && form.label)
  	return form.label;
  return undefined;
}

/*
 * Get the form fields
 */
Template.dataentry.formfields = function () {
  var form = getForm();
  if (form && form.fields)
  	return form.fields;
  return undefined;
}

/*
 * Get the list of locations
 */
Template.dataentry.location = function () {
  var config = Configuration.findOne();
  if (config && config.locations)
    return config.locations;
  return undefined;
}

/*
 * Returns whether the form is location bound.
 * If so the location field should be added.
 */
Template.dataentry.isLocationBound = function () {
  var form = getForm();
  if (form && form.locationbound)
    return form.locationbound;
  return false;
}

/*
 * Returns whether the user does have a location
 */
Template.dataentry.isLocalUser = function () {
  var loggedInUser = Meteor.user();

  if (loggedInUser && loggedInUser.roles && loggedInUser.roles[0]) {
    var config = Configuration.findOne();
    
    if (config && config.roles) {
      for (var i=0;i<config.roles.length;i++) {
        if (config.roles[i].name === loggedInUser.roles[0] && config.roles[i].location) {
          return true;
        }
      }

    }
  }
  return false;
}

/*
 * Get the user location
 */
Template.dataentry.userLocation = function () {
  var loggedInUser = Meteor.user();

  if (loggedInUser && loggedInUser.roles && loggedInUser.roles[0]) {
    var config = Configuration.findOne();
    
    if (config && config.roles) {
      for (var i=0;i<config.roles.length;i++) {
        if (config.roles[i].name === loggedInUser.roles[0] && config.roles[i].location) {
          return config.roles[i].location;
        }
      }

    }
  }
  return "";
}

/*
 * Compare function
 */
Template.dataentry.isEqual = function (a, b) {
  if (a === b)
  	return true;
  return false;
}

/*****************************************************************************
 * General functions
 *****************************************************************************/

/*
 * Get the current selected form based on the URL.
 */
function getForm() {
  // Get the configuration
  var config = Configuration.findOne();
  if (config && config.forms) {

    // Parse each form to find the correct one
    for (var i=0;i<config.forms.length;i++) {
    	if (config.forms[i].id === FORM_ID) {
    		return config.forms[i];
    	}
    }
  }

  return undefined;
}

function resetInputFields() {
  var tags = new Array();
  var form = getForm();

  // Get the field tags
  for(var i=0;i<form.fields.length;i++) {
    for(var j=0;j<form.fields[i].inputs.length;j++) {
      tags.push(form.fields[i].inputs[j].name);
    }
  }
  // Get the field values
  for(var i=0;i<tags.length;i++) {
    document.getElementById(tags[i]).value = "";
  }
}

/*****************************************************************************
 * Event functions
 *****************************************************************************/

Template.dataentry.events({
  /*
   * Executed when clicking the Submit button
   */
  'click .submit':function(e) {
  	var tags = new Array();
  	var values = new Array();
  	var form = getForm();

  	// Get the field tags
  	for(var i=0;i<form.fields.length;i++) {
  		for(var j=0;j<form.fields[i].inputs.length;j++) {
  			tags.push(form.fields[i].inputs[j].name);
  		}
  	}
  	// Get the field values
  	for(var i=0;i<tags.length;i++) {
  		values.push(document.getElementById(tags[i]).value);
  	}

    // Append the static fields
    if (form && form.locationbound && form.locationbound === true) {
      tags.push('location');
      values.push(Number(document.getElementById('static_location').value));
    }
    tags.push('timestamp');
    values.push(Number(moment("01-"+document.getElementById('static_month').value+"-"+document.getElementById('static_year').value+" 12:00", "DD-MM-YYYY HH:mm").unix() * 1000));

    // Do the dynamic insert
  	Meteor.call('dynamicinsert', form.name, tags, values, function (error, result) {
      	// If error
      	if (error) {
        	throwError(error.reason);
        }
   	});

    // Reset edit_id and clear input fields
    resetInputFields();

    // Do not submit
    return false;
  }
});