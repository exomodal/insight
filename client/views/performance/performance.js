/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the 'this.data' variable which
 * will be used by the SingleGraph template.
 */
Template.performance.initialize = function() {
  this.data = {"label":"Moves per Manhour",
              "form":6,
              "names":["bargemovesin","bargemovesout","truckmovesin","truckmovesout","trainmovesin","trainmovesout"],
              "split":"terminalmanhours"};
}