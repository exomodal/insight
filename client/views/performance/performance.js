// Variable declarations
var PERFORMANCE_TAGS = {"label":"Moves per Manhour",
                        "form":6,
                        "names":["bargemovesin","bargemovesout","truckmovesin","truckmovesout","trainmovesin","trainmovesout"],
                        "split":"terminalmanhours"};

var PERFORMANCE_START_MONTH = 1;
var PERFORMANCE_START_YEAR = 2008;

var PERFORMANCE_START_PIE;
var PERFORMANCE_END_PIE;

/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the default variables
 * which should be located in the 'this.data' variable.
 */
Template.performance.initialize = function() {
}

/*****************************************************************************
 * General function
 *****************************************************************************/

/*
 * This function calculates the amount of months between
 * two given timestamps.
 */
function monthDifference(d1, d2) {
    var months;
    months = (moment(d2).year() - moment(d1).year()) * 12;
    months -= moment(d1).month();
    months += moment(d2).month() + 1;
    return months <= 0 ? 0 : months;
}

/*
 * Convert timestamp into year
 */
function toYear(timestamp) {
  if (timestamp && timestamp !== 0)
    return moment.unix(timestamp/1000).year();
  return "";
}

/*
 * Convert timestamp into month
 */
function toMonth(timestamp) {
  if (timestamp && timestamp !== 0)
    return GLOBAL_MONTHS[moment.unix(timestamp/1000).month()];
  return "";
}

/*
 * Convert timestamp into month
 */
function toMonthNumber(timestamp) {
  if (timestamp && timestamp !== 0)
    return moment.unix(timestamp/1000).month() + 1;
  return "";
}

/*
 * This function build the datasets.
 */
function buildSeries(line_data) {
  var datasets = new Array();

  // Build the datasets for line and bar graphs
  if (form_isLocationBound(PERFORMANCE_TAGS.form)) {
    var locations = config_locations();
    for (var i=0;i<locations.length;i++) {
      datasets.push(
        {
          name:PERFORMANCE_TAGS.label + " " + locations[i].name,
          data:line_data[PERFORMANCE_TAGS.label + " " + locations[i].name],
          tooltip:{valueDecimals:2},
        });
    }
  }

  // Build the datasets for empty pie graphs.
  // We will fill the pie data later.
  var xAxis = 100;
  if (form_isLocationBound(PERFORMANCE_TAGS.form)) {
    var locations = config_locations();
    for (var i=0;i<locations.length;i++) {
      datasets.push({
        type:'pie',
        name:PERFORMANCE_TAGS.label + " " + locations[i].name,
        data: [],
        center: [xAxis, 30],
        size:100,
        showInLegend:false,
        dataLabels: {
          enabled: false
        }
      });

      xAxis += 110;
    }
  }

  return datasets;
}

/*
 * This function updates the pie series data based
 * on the selected start and end date (navigator).
 */
function updatePieSeries() {
  // Initialize arrays
  var pie_data = new Object();

  if (form_isLocationBound(PERFORMANCE_TAGS.form)) {
    var locations = config_locations();
    for (var i=0;i<locations.length;i++) {
      pie_data[PERFORMANCE_TAGS.label + " " + locations[i].name] = new Array();
    }
  } else {
    pie_data[PERFORMANCE_TAGS.label] = new Array();
  }

  // Calculate timestamps
  var start_timestamp = Number(moment(PERFORMANCE_START_PIE).unix() * 1000);
  var end_timestamp = Number(moment(PERFORMANCE_END_PIE).unix() * 1000);

  // Parse each month
  var month_count = monthDifference(start_timestamp, end_timestamp);
  var month = moment.unix(start_timestamp/1000).month() + 1;
  var year = moment.unix(start_timestamp/1000).year();
  for (var i=0;i<month_count;i++) {

    // Append data
    var ts1 = Number(moment(month+"-"+year, "MM-YYYY").unix() * 1000);
    var ts2 = Number(moment((month+1)+"-"+year, "MM-YYYY").unix() * 1000);

    // Get the actual data
    if (form_isLocationBound(PERFORMANCE_TAGS.form)) {
      var locations = config_locations();
      for (var k=0;k<locations.length;k++) {

        var doc = collection_findOne(form_name(PERFORMANCE_TAGS.form), {location:Number(locations[k].id), timestamp:{$gt:ts1,$lt:ts2}});
        var total = 0;

        for (var j=0;j<PERFORMANCE_TAGS.names.length;j++) {
          if (doc && doc[PERFORMANCE_TAGS.names[j]]) {
            total += Number(doc[PERFORMANCE_TAGS.names[j]]);
          }
        }

        if (doc && doc[PERFORMANCE_TAGS.split]) {
          total = total / Number(doc[PERFORMANCE_TAGS.split]);
        }

        pie_data[PERFORMANCE_TAGS.label + " " + locations[k].name].push([GLOBAL_MONTHS[month-1]+' '+year, total]);

      }
    } //else {
      //var doc = collection_findOne(form_name(PERFORMANCE_TAGS.form), {timestamp:{$gt:ts1,$lt:ts2}});
    //}
    
    

    // update the counter
    month++;
    if (month > GLOBAL_MONTHS.length) {
      month = 1;
      year++;
    }
  }

  // Update the datasets for pie graphs
  var chart = $('#chartContainer').highcharts();
  var j = 0;
  if (form_isLocationBound(PERFORMANCE_TAGS.form)) {
    var locations = config_locations();
    for (var i=0;i<locations.length;i++) {
      chart.series[j+_.size(pie_data)].update({data:pie_data[PERFORMANCE_TAGS.label + " " + locations[i].name]});
      j++;
    }
  }
}

/*
 * This function handles the complete constuction and displaying of the charts.
 */
function renderGraph() {
  // Initialize arrays
  var line_data = new Object();

  if (form_isLocationBound(PERFORMANCE_TAGS.form)) {
    var locations = config_locations();
    for (var i=0;i<locations.length;i++) {
      line_data[PERFORMANCE_TAGS.label + " " + locations[i].name] = new Array();
    }
  } else {
    line_data[PERFORMANCE_TAGS.label] = new Array();
  }
  
  // Calculate timestamps
  var start_timestamp = Number(moment(PERFORMANCE_START_MONTH+"-"+PERFORMANCE_START_YEAR, "MM-YYYY").unix() * 1000);
  var end_timestamp = Number(moment());

  // Parse each month
  var month_count = monthDifference(start_timestamp, end_timestamp);
  var month = Number(PERFORMANCE_START_MONTH);
  var year = Number(PERFORMANCE_START_YEAR);
  for (var i=0;i<month_count;i++) {

    // Append data
    var ts1 = Number(moment(month+"-"+year, "MM-YYYY").unix() * 1000);
    var ts2 = Number(moment((month+1)+"-"+year, "MM-YYYY").unix() * 1000);

    if (form_isLocationBound(PERFORMANCE_TAGS.form)) {
      var locations = config_locations();
      for (var k=0;k<locations.length;k++) {

        var doc = collection_findOne(form_name(PERFORMANCE_TAGS.form), {location:Number(locations[k].id), timestamp:{$gt:ts1,$lt:ts2}});
        var total = 0;

        for (var j=0;j<PERFORMANCE_TAGS.names.length;j++) {
          if (doc && doc[PERFORMANCE_TAGS.names[j]]) {
            total += Number(doc[PERFORMANCE_TAGS.names[j]]);
          }
        }

        if (doc && doc[PERFORMANCE_TAGS.split]) {
          total = total / Number(doc[PERFORMANCE_TAGS.split]);
        }

        line_data[PERFORMANCE_TAGS.label + " " + locations[k].name].push([ts1 + 86400000, total]);

      }
    } //else {
      //var doc = collection_findOne(form_name(PERFORMANCE_TAGS.form), {timestamp:{$gt:ts1,$lt:ts2}});
    //}

    // update the counter
    month++;
    if (month > GLOBAL_MONTHS.length) {
      month = 1;
      year++;
    }
  }

  // Now we have all data and labels so we can display the chart
  $('#chartContainer').highcharts('StockChart', {
    rangeSelector: {selected:4,inputDateFormat:'%b %Y',inputEditDateFormat:'%b %Y'},
    xAxis:{
      events: {
        setExtremes: function(e) {
          if (e.min !== PERFORMANCE_START_PIE || e.max !== PERFORMANCE_END_PIE) {
            PERFORMANCE_START_PIE = e.min;
            PERFORMANCE_END_PIE = e.max;
            Session.set("UPDATE_PERFORMANCE_PIE", e.min + e.max);
          }
        }
      },
      type:'datetime',tickInterval:30*24*3600000,labels:{formatter:function() {return Highcharts.dateFormat("%b %Y", this.value);}}},
    title: {text:''},
    legend: {enabled:true},
    chart: {
      type: 'spline',
      events: {
        load: function(event) {
          PERFORMANCE_START_PIE = event.currentTarget.axes[0].userMin;
          PERFORMANCE_END_PIE = event.currentTarget.axes[0].userMax;
          Session.set("UPDATE_PERFORMANCE_PIE", event.currentTarget.axes[0].userMin);
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} EUR</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    series:buildSeries(line_data)
  });

  // Update the pie series
  updatePieSeries();
}

/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.performance.rendered = function ()  {
  renderGraph();

  Deps.autorun(function () {
    var update = Session.get("UPDATE_PERFORMANCE_PIE");
    updatePieSeries();
  });
}