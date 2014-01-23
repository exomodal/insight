/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the 'this.data' variable which
 * will be used by the SingleGraph template.
 */
Template.revenues.initialize_graph = function() {
  this.data = {"collection":"customerservice",
              "ignore":["_id","location","timestamp"]};
}