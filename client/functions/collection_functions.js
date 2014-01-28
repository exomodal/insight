/*****************************************************************************
 * Global Collection functions
 *****************************************************************************/

/*
 * This function will execute the find query onto the
 * correct collection.
 */
collection_find = function(collection, selector, options) {
	// If objects are undefined construct an empty query
	if (!selector) { selector = {}; }
	if (!options) { options = {}; }

	// Do a find onto the correct collection
	if (collection === "management") {
	  return Management.find(selector, options);
	} else if (collection === "customerservice") {
	  return Customerservice.find(selector, options);
	} else if (collection === "intermodalplanning") {
	  return Intermodalplanning.find(selector, options);
	} else if (collection === "truckplanning") {
	  return Truckplanning.find(selector, options);
	} else if (collection === "terminalmanager") {
	  return TerminalManager.find(selector, options);
	}
}

/*
 * This function will execute the findOne query onto the
 * correct collection.
 */
collection_findOne = function(collection, selector, options) {
	// If objects are undefined construct an empty query
	if (!selector) { selector = {}; }
	if (!options) { options = {}; }

	// Do a findOne onto the correct collection
	if (collection === "management") {
	  return Management.findOne(selector, options);
	} else if (collection === "customerservice") {
	  return Customerservice.findOne(selector, options);
	} else if (collection === "intermodalplanning") {
	  return Intermodalplanning.findOne(selector, options);
	} else if (collection === "truckplanning") {
	  return Truckplanning.findOne(selector, options);
	} else if (collection === "terminalmanager") {
	  return TerminalManager.findOne(selector, options);
	}
}