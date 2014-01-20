// Variable declarations
var FORM_ID;

/*****************************************************************************
 * Variable functions
 *****************************************************************************/

/*
 * This function sets the form id variable based on the URL.
 */
function setFormId(data) {
  	if (data !== undefined && data[0] !== undefined) {
    	FORM_ID = Number(data[0]);
  	} else {
    	FORM_ID = -1;
  	}
}

/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * Get all lock data from one lock name and direction ordered by schuttime, then eta.
 */
Template.dataentry.setForm = function () {
	// Run this script to set correct form id
  	setFormId(this);
}

/*
 * Get the form label
 */
Template.dataentry.formlabel = function () {
  	var form = getForm();
  	if (form !== undefined && form.label !== undefined)
  		return form.label;
  	return undefined;
}

/*
 * Get the form label
 */
Template.dataentry.formfields = function () {
  	var form = getForm();
  	if (form !== undefined && form.fields !== undefined)
  		return form.fields;
  	return undefined;
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
  	if (config !== undefined && config.forms !== undefined) {

  		// Parse each form to find the correct one
  		for (var i=0;i<config.forms.length;i++) {
  			if (config.forms[i].id === FORM_ID) {
  				return config.forms[i];
  			}
  		}
  	}

  	return undefined;
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
  	console.log(tags);
  	console.log(values);

  	Meteor.call('dynamicinsert', form.name, tags, values, function (error, result) {
      	// If error
      	if (error) {
        	throwError(error.reason);
        }
   	});

    // Reset edit_id and clear input fields
    //resetInputFields();

    // Do not submit
    return false;
  }
});

/*****************************************************************************
 * Rendered function
 *****************************************************************************/

/**
 * Template rendering function
 */
//Template.dataentry.rendered=function() {
  // Initialize the input fields
//  resetInputFields();
//}