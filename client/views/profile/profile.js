/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * This function returns the email address of the user.
 */
Template.profile.email = function() {
	// Get the logged in user
  var loggedInUser = Meteor.user();
  if (loggedInUser && loggedInUser.profile !== undefined && loggedInUser.profile.email !== undefined) {
  	return loggedInUser.profile.email;
  }
  return "";
}

/*
 * This function returns the name of the user.
 */
Template.profile.fullname = function() {
	// Get the logged in user
  var loggedInUser = Meteor.user();
  if (loggedInUser && loggedInUser.profile !== undefined && loggedInUser.profile.name !== undefined) {
    return loggedInUser.profile.name;
  }
  return "";
}

/*
 * This function returns the role of the user.
 */
Template.profile.role = function() {
	// Get the logged in user
  var loggedInUser = Meteor.user();
  if (loggedInUser && loggedInUser.roles !== undefined && loggedInUser.roles[0] !== undefined) {
    return loggedInUser.roles[0];
  }
  return "";
}

/*
 * Returns whether the user does have a location
 */
Template.profile.isLocalUser = function () {
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
Template.profile.location = function () {
  var loggedInUser = Meteor.user();
  var location;

  if (loggedInUser && loggedInUser.roles && loggedInUser.roles[0]) {
    var config = Configuration.findOne();
    
    if (config && config.roles) {
      for (var i=0;i<config.roles.length;i++) {
        if (config.roles[i].name === loggedInUser.roles[0] && config.roles[i].location) {
          location = config.roles[i].location;
        }
      }
    }

    if (location && config && config.locations) {
      for (var i=0;i<config.locations.length;i++) {
        if (config.locations[i].id === location && config.locations[i].name) {
          return config.locations[i].name;
        }
      }
    }
  }
  return "";
}