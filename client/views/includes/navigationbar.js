/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * Get all forms from the configuration collection.
 */
Template.navigationbar.form = function() {
	// Get the configuration data from the collection
	var loggedInUser = Meteor.user();
	var config = Configuration.findOne();
	var forms = new Array();

	// Check if we got some configurations for the forms
	if (config !== undefined && config.forms !== undefined && config.roles !== undefined &&
			loggedInUser && loggedInUser.roles !== undefined && loggedInUser.roles[0] !== undefined) {

		// Get the allowed forms
		var allowedForms;
		for (var i=0;i<config.roles.length;i++) {
			if (config.roles[i].name === loggedInUser.roles[0])
				allowedForms = config.roles[i].forms;
		}

		// Get the forms
		for (var j=0;j<allowedForms.length;j++) {
			for (var k=0;k<config.forms.length;k++) {
				if (allowedForms[j] === config.forms[k].id)
					forms.push(config.forms[k]);
			}
		}

		return forms;
	}
	return undefined;
}