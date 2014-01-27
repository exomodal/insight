// Global variable declarations
GLOBAL_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/*****************************************************************************
 * Global functions
 *****************************************************************************/

/*
 * Get the form selected by its id.
 */
form_get = function(id) {
  // Get the configuration
  var config = Configuration.findOne();
  if (config && config.forms) {

    // Parse each form to find the correct one
    for (var i=0;i<config.forms.length;i++) {
    	if (config.forms[i].id === id) {
    		return config.forms[i];
    	}
    }
  }

  return undefined;
}

/*
 * Returns whether the form is location bound.
 * If so the location field should be added.
 */
form_isLocationBound = function (id) {
  var form = form_get(id);
  if (form && form.locationbound)
    return form.locationbound;
  return false;
}

/*
 * Get the form label
 */
form_label = function (id) {
  var form = form_get(id);
  if (form && form.label)
    return form.label;
  return undefined;
}

/*
 * Get the form fields
 */
form_fields = function (id) {
  var form = form_get(id);
  if (form && form.fields)
    return form.fields;
  return undefined;
}