/*****************************************************************************
 * Global Configuration functions
 *****************************************************************************/

/*
 * Get the list of locations
 */
config_locations = function () {
  var config = Configuration.findOne();
  if (config && config.locations)
    return config.locations;
  return undefined;
}