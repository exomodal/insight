/*****************************************************************************
 * Global User functions
 *****************************************************************************/

/*
 * Returns whether the user does have a location.
 */
user_isLocal = function () {
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
 * Returns the user location if it has one.
 */
user_location = function () {
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