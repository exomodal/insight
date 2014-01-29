// Definition of all paths which are allowed to be viewed by
// all non-loggedin clients.
var PUBLIC_PATHS = new Array("/", "/about");

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
  var config = Configuration.findOne();
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
      this.render('accesdenied');
      this.stop();
      return;
    }

    // The user is logged in, if the user is not verified
    // display the verification page.
    if (!userVerified(loggedInUser)) {
      Meteor.subscribe('configuration');
      Meteor.subscribe('users', Meteor.user());
      this.render('verificating');
      this.stop();

    // If the user is verified
    } else {
      // Check if the user is not allowed on the path
      if (!userAllowed(loggedInUser, this.path)) {
        this.render('notauthorized');
        this.stop();

      // If the user is allowed on the path just display
      } else {}
    }
  }
}

/*
 * This is the authentication filter which will check if we are allowed
 * to view the current form.
 */
authenticateForm = function () {
  var config = Configuration.findOne();
  var loggedInUser = Meteor.user();
  var minorPath;
  var allowedForms;
  var allowed = false;

  // Get the major path name (first part)
  var split = this.path.split("/");
  minorPath = Number(split[2]);

  // Check if we got some configurations for the forms
  if (config !== undefined && config.forms !== undefined && config.roles !== undefined &&
      loggedInUser && loggedInUser.roles !== undefined && loggedInUser.roles[0] !== undefined) {

    // Get the allowed forms
    for (var i=0;i<config.roles.length;i++) {
      if (config.roles[i].name === loggedInUser.roles[0])
        allowedForms = config.roles[i].forms;
    }
  }

  // Check if we are allowed to view this form
  for (var i=0;i<allowedForms.length;i++) {
    if (allowedForms[i] === minorPath) {
      allowed = true;
    }
  }
  
  if (!allowed) {
    this.render('notauthorized');
    this.stop();
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
  notFoundTemplate: 'notfound',
  waitOn: function() {
    return [
      // Here subscribe to all collections which we are allowed to read
      // from in all pages. Other subscriptions are located in the Router itself.
      Meteor.subscribe('configuration'),
      Meteor.subscribe('customerservice'),
      Meteor.subscribe('intermodalplanning'),
      Meteor.subscribe('management'),
      Meteor.subscribe('terminalmanager'),
      Meteor.subscribe('truckplanning'),
      Meteor.subscribe('users', Meteor.user())
    ];
  }
});

/*
 * Defines routes for the router.
 */
Router.map(function() {
  
  this.route('home', {
    path: '/',
    template: 'home'
    });

  this.route('about', {
    path: '/about',
    template: 'about',
   });

  this.route('moves', {
    path: '/moves',
    template: 'moves',
    before: authenticate
  });
  
  this.route('revenues', {
    path: '/revenues',
    template: 'revenues',
    before: authenticate
  });

  this.route('formsList', {
    path: '/forms/:_id',
    data: function() { return [this.params._id]; },
    template: 'formsList',
    before: [authenticate, authenticateForm]
  });

  this.route('dataentry', {
    path: '/entry/:_id/:_editid',
    data: function() { return [this.params._id, this.params._editid]; },
    template: 'dataentry',
    before: [authenticate, authenticateForm]
  });

  this.route('adminUser', {
    path: '/adminuser',
    template: 'adminUser',
    before: authenticate,
    after: function() { return Meteor.subscribe('users'); 
  }}); // Only allow the user to this collection if allowed.

  this.route('adminConfig', {
    path: '/adminconfig',
    template: 'adminConfig',
    before: authenticate
  });

  this.route('profile', {
    path: '/profile',
    template: 'profile',
    before: authenticate
  });

  /*
   * Templates for perfomance graphs
   * Later in configuration
   */
  this.route('performance1', {
    path: '/performance/mph',
    data: function() { return {"data":{"label":"Moves per Manhour","unit":"M/h","locationbound":true,"count":[{"form":6,"names":["bargemovesin","bargemovesout","truckmovesin","truckmovesout","trainmovesin","trainmovesout"]}],"split":[{"form":6,"names":["terminalmanhours"]}]}}; },
    template: 'performance',
    before: authenticate
  });
  this.route('performance2', {
    path: '/performance/kwhfactor',
    data: function() { return {"data":{"label":"KwH Factor","unit":"","locationbound":false,"count":[{"form":1,"names":["officekwh"]},{"form":4,"names":["kwhrail"]},{"form":6,"names":["cranekwh","terminalkwh"]}],"split":[{"form":6,"names":["terminalmanhours"]}]}}; },
    template: 'performance',
    before: authenticate
  });
});