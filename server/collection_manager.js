
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
			console.log("customerservice insert");
			//Management.insert
		} else if (collection === "intermodalplanning") {
			console.log("intermodalplanning insert");
			//Management.insert
		} else if (collection === "truckplanning") {
			console.log("truckplanning insert");
			//Management.insert
		} else if (collection === "terminalmanager") {
			console.log("terminalmanager insert");
			//Management.insert
		}
	}
});