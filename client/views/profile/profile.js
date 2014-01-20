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