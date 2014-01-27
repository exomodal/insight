var FORM_COLLECTIONS = ["management","customerservice","intermodalplanning","truckplanning","terminalmanager"];
var START_MONTH = 1;
var START_YEAR = 2008;

Meteor.methods({
	/*
	 * Provide a function that can be invoked over the network by clients.
	 * This function inserts into a collection.
	 */
	dynamicupdate: function(collection, id, tags, values) {

		// Create the JSON object
		var obj = {};
		for (var i=0;i<tags.length;i++) {
			obj[""+tags[i]] = values[i];
		}

		// Insert the object to the collection
		if (collection === "management") {
			Management.update({_id:id}, {$set:obj});
		} else if (collection === "customerservice") {
			Customerservice.update({_id:id}, {$set:obj});
		} else if (collection === "intermodalplanning") {
			Intermodalplanning.update({_id:id}, {$set:obj});
		} else if (collection === "truckplanning") {
			Truckplanning.update({_id:id}, {$set:obj});
		} else if (collection === "terminalmanager") {
			TerminalManager.update({_id:id}, {$set:obj});
		}
	}
});

/*****************************************************************************
 * Collection function
 *****************************************************************************/

/*
 * This function will execute the findOne query onto the
 * correct collection.
 */
function findOne(collection, obj) {
	// If object is undefined construct an empty query
	if (!obj) { obj = {}; }

	// Do a findOne onto the correct collection
	if (collection === "management") {
	  return Management.findOne(obj);
	} else if (collection === "customerservice") {
	  return Customerservice.findOne(obj);
	} else if (collection === "intermodalplanning") {
	  return Intermodalplanning.findOne(obj);
	} else if (collection === "truckplanning") {
	  return Truckplanning.findOne(obj);
	} else if (collection === "terminalmanager") {
	  return TerminalManager.findOne(obj);
	}
}

/*
 * This function will execute the insert query onto the
 * correct collection.
 */
function insert(collection, obj) {
	// We can only do an insert if the object is defined
	if (obj) {
		// Do a insert onto the correct collection
		if (collection === "management") {
		  return Management.insert(obj);
		} else if (collection === "customerservice") {
		  return Customerservice.insert(obj);
		} else if (collection === "intermodalplanning") {
		  return Intermodalplanning.insert(obj);
		} else if (collection === "truckplanning") {
		  return Truckplanning.insert(obj);
		} else if (collection === "terminalmanager") {
		  return TerminalManager.insert(obj);
		}
	}
}

/*****************************************************************************
 * General function
 *****************************************************************************/

function monthDifference(d1, d2) {
    var months;
    months = (moment(d2).year() - moment(d1).year()) * 12;
    months -= moment(d1).month();
    months += moment(d2).month() + 1;
    return months <= 0 ? 0 : months;
}

function formIsLocationBound(name) {
	var config = Configuration.findOne();

	if (config && config.forms) {
		for (var i=0;i<config.forms.length;i++) {
			if (config.forms[i].name === name) {
				if (config.forms[i].locationbound) {
					return config.forms[i].locationbound;
				}
				return false;
			}
		}
	}
	return false;
}

function getLocations() {
	var config = Configuration.findOne();

	if (config && config.locations) {
		return config.locations;
	}
	return undefined;
}

Meteor.startup(function () {
	// Calculate timestamps
    var start_timestamp = Number(moment("01-"+START_MONTH+"-"+START_YEAR+" 00:00", "DD-MM-YYYY HH:mm").unix() * 1000);
    var end_timestamp = Number(moment());

	// Parse each month
    var month_count = monthDifference(start_timestamp, end_timestamp);
    var month = Number(START_MONTH);
    var year = Number(START_YEAR);
    for (var i=0;i<month_count;i++) {

    	// For every month, parse each collection
    	for (var j=0;j<FORM_COLLECTIONS.length;j++) {
    		// Get the document for the month, if available
	    	var ts1 = Number(moment("01-"+month+"-"+year+" 00:00", "DD-MM-YYYY HH:mm").unix() * 1000);
	      	var ts2 = Number(moment("28-"+month+"-"+year+" 23:00", "DD-MM-YYYY HH:mm").unix() * 1000);
	      	var locationBound = formIsLocationBound(FORM_COLLECTIONS[j]);

	      	if (locationBound) {
	      		var locations = getLocations();
	      		for (var k=0;k<locations.length;k++) {
	      			// Get the document
			      	var doc = findOne(FORM_COLLECTIONS[j], {location:locations[k].id, timestamp:{$gt:ts1,$lt:ts2}});

			      	// If it does not exist for this month, create it
			      	if (!doc) {
			      		var timestamp = Number(moment("15-"+month+"-"+year+" 00:00", "DD-MM-YYYY HH:mm").unix() * 1000);
			      		insert(FORM_COLLECTIONS[j], {"location":locations[k].id, "timestamp":timestamp});
			      	}
	      		}

	      	} else {
	      		// Get the document
		      	var doc = findOne(FORM_COLLECTIONS[j], {timestamp:{$gt:ts1,$lt:ts2}});

		      	// If it does not exist for this month, create it
		      	if (!doc) {
		      		var timestamp = Number(moment("15-"+month+"-"+year+" 00:00", "DD-MM-YYYY HH:mm").unix() * 1000);
		      		insert(FORM_COLLECTIONS[j], {"timestamp":timestamp});
		      	}
		    }
    	}

    	// update the counter
		month++;
		if (month > 12) {
		   	month = 1;
		   	year++;
		}
    }

});