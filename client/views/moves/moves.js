/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the 'this.data' variable which
 * will be used by the SingleGraph template.
 */
Template.moves.initialize_graph = function() {
  this.data = {"form":6,
              "ignore":["_id","location","timestamp","bargeteusin","bargeteusout","truckteusin","truckteusout","trainteusin","trainteusout","cranediesel","cranekwh","terminaldiesel","terminalkwh","terminalmanhours"]};
}