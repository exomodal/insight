// Definition of all paths which are allowed to be viewed by
// all non-loggedin clients.
var PUBLIC_PATHS = new Array("/");

/*****************************************************************************
 * General functions
 *****************************************************************************/

/*
 * Returns whether the profile of the user is verified.
 */
function userVerified(user) {
	if (user.profile !== undefined && user.profile.verified !== undefined) {
		return user.profile.verified;
	}
	return false;
}

/*
 * Returns whether the user is allowed to go to the path or not.
 * This function uses the roles configured in the Configuration collection.
 */
function userAllowed(user, path) {
  var majorPath;
  var userRole;
  var allowedLinks;

  // Get the major path name (first part)
  var split = path.split("/");
  majorPath = "/" + split[1];

  // Get the user role
  if (user.roles !== undefined && user.roles[0] !== undefined) {
    userRole = user.roles[0];
  }

  // Get the allowed links from the configuration
  var config = configuration.findOne();
  if (config !== undefined && config.roles !== undefined) {
    // Parse each role to find the correct one
    config.roles.forEach(function (role) {
      if (role.name === userRole) {
        allowedLinks = role.allowedlinks;
      }
    });
  }

  // If we got the user role and allowed links check if the
  // user is allowed to go on the current path.
  if (userRole !== undefined && allowedLinks !== undefined) {
    for (var i=0;i<allowedLinks.length;i++) {
      if (allowedLinks[i] === majorPath) {
        return true;
      }
    }
  }
  return false;
}

/*****************************************************************************
 * Login filter
 *****************************************************************************/

/*
 * This is the authentication filter which will be used in the router.
 */
authenticate = function () {
  // If user is logging in render the loading page
  if (Meteor.loggingIn()) {
    this.render('loading');
    this.stop();

  // Else do this
  } else {
    var loggedInUser = Meteor.user();

    // If the user is not logged in
    if (!loggedInUser) {
      // Check if the user is on a public path
      for (var i=0;i<PUBLIC_PATHS.length;i++) {
        if (PUBLIC_PATHS[i] === this.path) {
          return;
        }
      }
      // If not display the message
      this.render('notAuthorized');
      this.stop();
      return;
    }

    // The user is logged in, if the user is not verified
    // display the verification page.
    if (!userVerified(loggedInUser)) {
      this.render('verificatingPage');
      this.stop();

    // If the user is verified
    } else {
      // Check if the user is not allowed on the path
      if (!userAllowed(loggedInUser, this.path)) {
        this.render('notAuthorized');
        this.stop();

      // If the user is allowed on the path just display
      } else {}
    }
  }
}

/*****************************************************************************
 * Router functions
 *****************************************************************************/

/*
 * Defines the default layout for the router.
 */
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    // Here subscribe to all collections which we are allowed to read
    // from in all pages. Other subscriptions are located in the Router itself.
    Meteor.subscribe('configuration');
  }
});

/*
 * Defines routes for the router.
 */
Router.map(function() {
  this.route('homePage', {
    path: '/',
    before: authenticate});

  this.route('adminPage', {
    path: '/adminpanel',
    before: authenticate,
    after: function() { Meteor.subscribe('users'); }}); // Only allow the user to this collection if allowed.

  this.route('profilePage', {
    path: '/profiel',
    before: authenticate});
});