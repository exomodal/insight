
Meteor.methods({
	/*
	 * Provide a function that can be invoked over the network by clients.
	 * This function inserts into a collection.
	 */
	dynamicinsert: function(collection, tags, values) {

		// Create the JSON object
		var obj = {};
		for (var i=0;i<tags.length;i++) {
			obj[""+tags[i]] = values[i];
		}

		// Insert the object to the collection
		if (collection === "management") {
			Management.insert(obj);
		} else if (collection === "customerservice") {
			Customerservice.insert(obj);
		} else if (collection === "intermodalplanning") {
			Intermodalplanning.insert(obj);
		} else if (collection === "truckplanning") {
			Truckplanning.insert(obj);
		} else if (collection === "terminalmanager") {
			TerminalManager.insert(obj);
		}
	}
});