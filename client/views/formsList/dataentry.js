// Variable declarations
var FORM_ID;
var FORM_EDIT_ID;
var FORM_NAME;

/*****************************************************************************
 * General Template functions
 *****************************************************************************/

/*
 * This function sets the form id variable based on the URL.
 */
Template.dataentry.initialize = function () {
	if (this && this[0] && this[1]) {
    FORM_ID = Number(this[0]);
    FORM_EDIT_ID = this[1];
    var form = form_get(FORM_ID);
    if (form && form.name) {
      FORM_NAME = form.name;
    }
  } else {
    FORM_ID = -1;
    FORM_EDIT_ID = -1;
    FORM_NAME = "";
  }
}

/*
 * Get the form id
 */
Template.dataentry.formid = function () {
  return FORM_ID;
}

/*
 * Get the form label
 */
Template.dataentry.formlabel = function () {
  return form_label(FORM_ID);
}

/*
 * Get the form fields
 */
Template.dataentry.formfields = function () {
  return form_fields(FORM_ID);
}

/*
 * Get the list of locations
 */
Template.dataentry.location = function () {
  return config_locations();
}

/*
 * Returns whether the form is location bound.
 * If so the location field should be added.
 */
Template.dataentry.isLocationBound = function () {
  return form_isLocationBound(FORM_ID);
}

/*
 * Returns whether the user does have a location
 */
Template.dataentry.isLocalUser = function () {
  return user_isLocal();
}

/*
 * Get the user location
 */
Template.dataentry.userlocation = function () {
  return user_location();
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

function getYear(timestamp) {
  if (timestamp && timestamp !== 0)
    return moment.unix(timestamp/1000).year();
  return "";
}

function getMonth(timestamp) {
  if (timestamp && timestamp !== 0)
    return moment.unix(timestamp/1000).month()+1;
  return "";
}

function resetInputFields() {
  var doc = collection_findOne(FORM_NAME, {_id:FORM_EDIT_ID}, {});

  if (doc) {
    // Set the year and month field
    document.getElementById('static_month').value = getMonth(doc.timestamp);
    document.getElementById('static_year').value = getYear(doc.timestamp);
    if (form_isLocationBound(FORM_ID)) {
      document.getElementById('static_location').value = doc.location;
      document.getElementById('static_location').disabled = true;
    }

    var tags = new Array();
    var form = form_get(FORM_ID);

    // Get the field tags
    for(var i=0;i<form.fields.length;i++) {
      for(var j=0;j<form.fields[i].inputs.length;j++) {
        tags.push(form.fields[i].inputs[j].name);
      }
    }
    // Get the field values
    for(var i=0;i<tags.length;i++) {
      if (doc[tags[i]]) {
        document.getElementById(tags[i]).value = doc[tags[i]];
      } else {
        document.getElementById(tags[i]).value = "";
      }
    }
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
  	var form = form_get(FORM_ID);

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

    // Do the dynamic update
  	Meteor.call('dynamicupdate', FORM_NAME, FORM_EDIT_ID, tags, values, function (error, result) {
      	// If error
      	if (error) {
        	throwError(error.reason);
        }
   	});

    // Go back to the lists
    return true;
  }
});

/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.dataentry.rendered = function() {
  resetInputFields();
}