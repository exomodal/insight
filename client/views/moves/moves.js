/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the 'this.data' variable which
 * will be used by the SingleGraph template.
 */
Template.moves.graph_1 = function() {
	var data = {"data":
	  	{"name":"totalmovesteu",
	  	"label":"Total Moves/TEU",
	  	"unit":"",
	  	"graphs":[
	  		{"label":"Total Moves",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["bargemovesin","bargemovesout","truckmovesin","truckmovesout","trainmovesin","trainmovesout"]}],
	  		"split":[]},
	  		{"label":"Total TEU",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["bargeteusin","bargeteusout","truckteusin","truckteusout","trainteusin","trainteusout"]}],
	  		"split":[]}
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}

Template.moves.graph_2 = function() {
	var data = {"data":
	  	{"name":"totalmovesteubarge",
	  	"label":"Total Moves/TEU Barge",
	  	"unit":"",
	  	"graphs":[
	  		{"label":"Total Moves",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["bargemovesin","bargemovesout"]}],
	  		"split":[]},
	  		{"label":"Total TEU",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["bargeteusin","bargeteusout"]}],
	  		"split":[]}
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}

Template.moves.graph_3 = function() {
	var data = {"data":
	  	{"name":"totalmovesteutruck",
	  	"label":"Total Moves/TEU Truck",
	  	"unit":"",
	  	"graphs":[
	  		{"label":"Total Moves",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["truckmovesin","truckmovesout"]}],
	  		"split":[]},
	  		{"label":"Total TEU",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["truckteusin","truckteusout"]}],
	  		"split":[]}
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}

Template.moves.graph_4 = function() {
	var data = {"data":
	  	{"name":"totalmovesteutrain",
	  	"label":"Total Moves/TEU Train",
	  	"unit":"",
	  	"graphs":[
	  		{"label":"Total Moves",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["trainmovesin","trainmovesout"]}],
	  		"split":[]},
	  		{"label":"Total TEU",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["trainteusin","trainteusout"]}],
	  		"split":[]}
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}

Template.moves.graph_5 = function() {
	var data = {"data":
	  	{"name":"alltotalmoves",
	  	"label":"All Total Moves",
	  	"unit":"",
	  	"graphs":[
	  		{"label":"Total Moves Barge",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["bargemovesin","bargemovesout"]}],
	  		"split":[]},
	  		{"label":"Total Moves Truck",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["truckmovesin","truckmovesout"]}],
	  		"split":[]},
	  		{"label":"Total Moves Train",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["trainmovesin","trainmovesout"]}],
	  		"split":[]},
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}

Template.moves.graph_6 = function() {
	var data = {"data":
	  	{"name":"alltotalteus",
	  	"label":"All Total TEU",
	  	"unit":"",
	  	"graphs":[
	  		{"label":"Total TEU Barge",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["bargeteusin","bargeteusout"]}],
	  		"split":[]},
	  		{"label":"Total TEU Truck",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["truckteusin","truckteusout"]}],
	  		"split":[]},
	  		{"label":"Total TEU Train",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":6,"names":["trainteusin","trainteusout"]}],
	  		"split":[]},
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}