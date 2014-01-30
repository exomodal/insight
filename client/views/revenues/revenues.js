/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the 'this.data' variable which
 * will be used by the SingleGraph template.
 */
Template.revenues.graph_1 = function() {
	var data = {"data":
	  	{"name":"allrevenues",
	  	"label":"All Revenue's",
	  	"unit":"EUR",
	  	"graphs":[
	  		{"label":"Revenue Barge",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenuebarge"]}],
	  		"split":[]},
	  		{"label":"Revenue Truck",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenuetruck"]}],
	  		"split":[]},
	  		{"label":"Revenue Inlandtruck",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenueinlandtruck"]}],
	  		"split":[]},
	  		{"label":"Revenue Handling",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenuehandling"]}],
	  		"split":[]},
	  		{"label":"Revenue Margin",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenuemargin"]}],
	  		"split":[]},
	  		{"label":"Revenue Other",
	  		"type":"column",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenueother"]}],
	  		"split":[]}
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}

Template.revenues.graph_2 = function() {
	var data = {"data":
	  	{"name":"revenuetotal",
	  	"label":"Total Revenue's",
	  	"unit":"EUR",
	  	"graphs":[
	  		{"label":"Total",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenuebarge","revenuehandling","revenueinlandtruck","revenuemargin","revenueother","revenuetruck"]}],
	  		"split":[]}
	  	]}
  	};

  	return Template['performanceGraphs'](data);
}

Template.revenues.graph_3 = function() {
  	var data = {"data":
	  	{"name":"revenueteumove",
	  	"label":"Revenue per TEU/Move",
	  	"unit":"EUR",
	 	"graphs":[
	  		{"label":"Revenue per Move",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenuebarge","revenuehandling","revenueinlandtruck","revenuemargin","revenueother","revenuetruck"]}],
	  		"split":[{"form":6,"names":["bargemovesin","bargemovesout","truckmovesin","truckmovesout","trainmovesin","trainmovesout"]}]},
	  		{"label":"Revenue per TEU",
	  		"type":"spline",
	  		"locationbound":false,
	  		"count":[{"form":3,"names":["revenuebarge","revenuehandling","revenueinlandtruck","revenuemargin","revenueother","revenuetruck"]}],
	  		"split":[{"form":6,"names":["bargeteusin","bargeteusout","truckteusin","truckteusout","trainteusin","trainteusout"]}]}
	  	]}
  	};
    
  	return Template['performanceGraphs'](data);
}