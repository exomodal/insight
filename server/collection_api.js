if (Meteor.isServer) {
  Meteor.startup(function () {

    // Initializing the Collection API 
    collectionApi = new CollectionAPI({
      authToken: '9900aa',                // Require this string to be passed in on each request
      apiPath: 'collectionapi',           // API path prefix
      standAlone: false,                  // Run as a stand-alone HTTP(S) server
      sslEnabled: false,                  // Disable/Enable SSL (stand-alone only)
      listenPort: 3005,                   // Port to listen to (stand-alone only)
      listenHost: undefined,              // Host to bind to (stand-alone only)
      privateKeyFile: 'privatekey.pem',   // SSL private key file (only used if SSL is enabled)
      certificateFile: 'certificate.pem'  // SSL certificate key file (only used if SSL is enabled)
    });

    // Add the collection Configuration to the API path
    collectionApi.addCollection(configuration, 'configuration', {
      authToken: undefined,
      methods: ['POST','GET','PUT','DELETE'],
      before: {
        POST: function(obj) {
          console.log('INSERTION INTO Configuration');
          configuration.remove({});
          // Return true to insert the complete batch
          return true;
        },
        GET: undefined,
        PUT: undefined,
        DELETE: undefined,
      }
    });

    // Add the collection Users to the API path
    collectionApi.addCollection(Meteor.users, 'users', {
      authToken: undefined,
      methods: ['POST','GET','PUT','DELETE'],
      before: {
        POST: function(obj) {
          console.log('INSERTION INTO Users');
          var id = obj._id;
          if (id !== undefined) {
            delete obj._id;
            Meteor.users.update({_id:id}, obj);
          }
          // Dont return true; Otherwise it will insert the the full batch in addition.
          return false;
        },
        GET: undefined,
        PUT: undefined,
        DELETE: undefined,
      }
    });

    // Starts the API server
    collectionApi.start();
  });
}