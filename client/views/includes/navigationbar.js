/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * Get all forms from the configuration collection.
 */
Template.navigationbar.form = function() {
	// Get the configuration data from the collection
	var config = Configuration.findOne();

	// Check if we got some configurations for the forms
	if (config !== undefined && config.forms !== undefined) {
		return config.forms;
	}
	return undefined;
}