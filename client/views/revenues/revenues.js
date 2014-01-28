/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the 'this.data' variable which
 * will be used by the SingleGraph template.
 */
Template.revenues.initialize_graph = function() {
  this.data = {"form":3,
              "ignore":["_id","location","timestamp"]};
}