// Variable declarations
var LIST_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var LIST_ID;

/*****************************************************************************
 * General Template functions
 *****************************************************************************/

/*
 * This function sets the form id variable based on the URL.
 */
Template.formsList.initialize = function () {
	if (this && this[0]) {
   	LIST_ID = Number(this[0]);
  } else {
   	LIST_ID = -1;
  }
}

/*
 * Get the form id
 */
Template.formsList.formid = function () {
  return LIST_ID;
}

/*
 * Get the form label
 */
Template.formsList.formlabel = function () {
  var form = getForm();
  if (form && form.label)
  	return form.label;
  return undefined;
}

/*
 * Get all data entries from the collection
 */
Template.formsList.entry = function () {
	var form = getForm();
  if (form && form.name) {
  	return find(form.name, {}, {sort:{timestamp:-1}});
  }
  return undefined;
}

/*
 * Convert timestamp into month
 */
Template.formsList.isComplete = function(entry) {
	var form = getForm();
  if (form && form.fields) {

  	// Parse each field
  	for (var i=0;i<form.fields.length;i++) {
  		// Parse each input
	 		for (var j=0;j<form.fields[i].inputs.length;j++) {
	 			if (!entry[form.fields[i].inputs[j].name] || entry[form.fields[i].inputs[j].name] === "") {
	 				return "incomplete";
	 			}
	 		}
  	}
 	}
 	return "complete";
}

/*
 * Convert timestamp into year
 */
Template.formsList.toYear = function(timestamp) {
  if (timestamp && timestamp !== 0)
   	return moment.unix(timestamp/1000).year();
  return "";
}

/*
 * Convert timestamp into month
 */
Template.formsList.toMonth = function(timestamp) {
  if (timestamp && timestamp !== 0)
   	return LIST_MONTHS[moment.unix(timestamp/1000).month()];
  return "";
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
    	if (config.forms[i].id === LIST_ID) {
    		return config.forms[i];
    	}
    }
  }

  return undefined;
}

/*****************************************************************************
 * Collection function
 *****************************************************************************/

/*
 * This function will execute the find query onto the
 * correct collection.
 */
function find(collection, selector, options) {
	// If object is undefined construct an empty query
	if (!selector) { selector = {}; }
	if (!options) { options = {}; }

	// Do a findOne onto the correct collection
	if (collection === "management") {
	  return Management.find(selector, options);
	} else if (collection === "customerservice") {
	  return Customerservice.find(selector, options);
	} else if (collection === "intermodalplanning") {
	  return Intermodalplanning.find(selector, options);
	} else if (collection === "truckplanning") {
	  return Truckplanning.find(selector, options);
	} else if (collection === "terminalmanager") {
	  return TerminalManager.find(selector, options);
	}
}