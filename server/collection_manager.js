
Meteor.methods({
	/*
	 * Provide a function that can be invoked over the network by clients.
	 * This function inserts into a collection.
	 */
	dynamicinsert: function(collection, tags, values) {
		console.log("Collection: " + collection);
		console.log(tags);
		console.log(values);

		if (collection === "management") {
			console.log("Management insert");
			//Management.insert
		}
	}
});