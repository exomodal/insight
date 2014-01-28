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
  return user_isLocal();
}

/*
 * Get the user location
 */
Template.profile.location = function () {
  var config = Configuration.findOne();
  var location = user_location();

  if (location && config && config.locations) {
    for (var i=0;i<config.locations.length;i++) {
      if (config.locations[i].id === location && config.locations[i].name) {
        return config.locations[i].name;
      }
    }
  }
  return "";
}