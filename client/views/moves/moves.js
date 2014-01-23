/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the 'this.data' variable which
 * will be used by the SingleGraph template.
 */
Template.moves.initialize_graph = function() {
  this.data = {"collection":"terminalmanager",
              "ignore":["_id","location","timestamp"]};
}