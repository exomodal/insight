// Local (client-only) collection
Errors = new Meteor.Collection(null);

/*****************************************************************************
 * General functions
 *****************************************************************************/

/*
 * This function adds the given message to the error list.
 */
throwError = function(message) {
  Errors.insert({message: message})
}

/*****************************************************************************
 * General template functions
 *****************************************************************************/

/*
 * This function returns all errors.
 */
Template.errors.error = function() {
  return Errors.find();
}

/*****************************************************************************
 * Event functions
 *****************************************************************************/

Template.error.events({

  /*
   * Executed when clicking the Close button
   */
  'click .close':function(e) {
    Errors.remove({_id: this._id});
  }
});