// Variable declarations
var SINGLEGRAPH_FORM;
var SINGLEGRAPH_IGNORE_TAGS;
var SINGLEGRAPH_RENDERED;

var START_MONTH = 1;
var START_YEAR = 2008;

var START_PIE;
var END_PIE;

/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the default variables
 * which should be located in the 'this.data' variable.
 */
Template.singleGraphs.initialize = function() {
  // Check if the data is available
  if (this.data && this.data.form && this.data.ignore) {
    SINGLEGRAPH_FORM = this.data.form;
    SINGLEGRAPH_IGNORE_TAGS = this.data.ignore;
    SINGLEGRAPH_RENDERED = false;

  // If the data is not available we throw an error
  } else {
    SINGLEGRAPH_FORM = undefined;
    SINGLEGRAPH_IGNORE_TAGS = undefined;
    throwError("The graphs are not correctly initialized! Please contact the administrator.");
  }
}

/*
 * Get the list of locations
 */
Template.singleGraphs.location = function () {
  return config_locations();
}

/*
 * Returns whether the form is location bound.
 * If so the location field should be added.
 */
Template.singleGraphs.isLocationBound = function () {
  return form_isLocationBound(SINGLEGRAPH_FORM);
}

/*
 * Returns whether the user does have a location
 */
Template.singleGraphs.isLocalUser = function () {
  return user_isLocal();
}

/*
 * Get the user location
 */
Template.singleGraphs.userlocation = function () {
  return user_location();
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
function buildSeries(tags, line_data) {
  var datasets = new Array();

  // Build the datasets for line and bar graphs
  for (var i=0;i<tags.length;i++) {
    if (SINGLEGRAPH_IGNORE_TAGS.indexOf(tags[i]) === -1) {
      datasets.push(
        {
          name:tags[i],
          data:line_data[tags[i]],
          tooltip:{valueDecimals:2},
        });
    }
  }

  // Build the datasets for empty pie graphs.
  // We will fill the pie data later.
  var xAxis = 100;
  for (var i=0;i<tags.length;i++) {
    if (SINGLEGRAPH_IGNORE_TAGS.indexOf(tags[i]) === -1) {
      datasets.push({
        type:'pie',
        name:tags[i],
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
  var tags = form_tags(SINGLEGRAPH_FORM);
  for (var i=0;i<tags.length;i++) {
    if (SINGLEGRAPH_IGNORE_TAGS.indexOf(tags[i]) === -1) {
      pie_data[tags[i]] = new Array();
    }
  }

  // Calculate timestamps
  var start_timestamp = Number(moment(START_PIE).unix() * 1000);
  var end_timestamp = Number(moment(END_PIE).unix() * 1000);

  // Parse each month
  var month_count = monthDifference(start_timestamp, end_timestamp);
  var month = moment.unix(start_timestamp/1000).month() + 1;
  var year = moment.unix(start_timestamp/1000).year();
  for (var i=0;i<month_count;i++) {

    // Append data
    var ts1 = Number(moment(month+"-"+year, "MM-YYYY").unix() * 1000);
    var ts2 = Number(moment((month+1)+"-"+year, "MM-YYYY").unix() * 1000);

    // Get the actual data
    if (form_isLocationBound(SINGLEGRAPH_FORM)) {
      var loc = document.getElementById('static_location').value;
      if (loc !== "") {
        var doc = collection_findOne(form_name(SINGLEGRAPH_FORM), {location:Number(loc), timestamp:{$gt:ts1,$lt:ts2}});
      }
    } else {
      var doc = collection_findOne(form_name(SINGLEGRAPH_FORM), {timestamp:{$gt:ts1,$lt:ts2}});
    }
    
    // Append data for each pie
    for (var j=0;j<tags.length;j++) {
      if (SINGLEGRAPH_IGNORE_TAGS.indexOf(tags[j]) === -1) {
        if (doc && doc[tags[j]]) {
          // If pie is in the range
          pie_data[tags[j]].push([GLOBAL_MONTHS[month-1]+' '+year, Number(doc[tags[j]])]);
        } else {
          // If pie is in the range
          pie_data[tags[j]].push([GLOBAL_MONTHS[month-1]+' '+year, 0]);
        }
      }
    }

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
  for (var i=0;i<tags.length;i++) {
    if (SINGLEGRAPH_IGNORE_TAGS.indexOf(tags[i]) === -1) {
      chart.series[j+_.size(pie_data)].update({data:pie_data[tags[i]]});
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
  var tags = form_tags(SINGLEGRAPH_FORM);
  for (var i=0;i<tags.length;i++) {
    if (SINGLEGRAPH_IGNORE_TAGS.indexOf(tags[i]) === -1) {
      line_data[tags[i]] = new Array();
    }
  }
  
  // Calculate timestamps
  var start_timestamp = Number(moment(START_MONTH+"-"+START_YEAR, "MM-YYYY").unix() * 1000);
  var end_timestamp = Number(moment());

  // Parse each month
  var month_count = monthDifference(start_timestamp, end_timestamp);
  var month = Number(START_MONTH);
  var year = Number(START_YEAR);
  for (var i=0;i<month_count;i++) {

    // Append data
    var ts1 = Number(moment(month+"-"+year, "MM-YYYY").unix() * 1000);
    var ts2 = Number(moment((month+1)+"-"+year, "MM-YYYY").unix() * 1000);

    if (form_isLocationBound(SINGLEGRAPH_FORM)) {
      var loc = document.getElementById('static_location').value;
      if (loc !== "") {
        var doc = collection_findOne(form_name(SINGLEGRAPH_FORM), {location:Number(loc), timestamp:{$gt:ts1,$lt:ts2}});
      }
    } else {
      var doc = collection_findOne(form_name(SINGLEGRAPH_FORM), {timestamp:{$gt:ts1,$lt:ts2}});
    }
    
    for (var j=0;j<tags.length;j++) {
      if (SINGLEGRAPH_IGNORE_TAGS.indexOf(tags[j]) === -1) {
        if (doc && doc[tags[j]]) {
          line_data[tags[j]].push([ts1 + 86400000, Number(doc[tags[j]])]);
        } else {
          line_data[tags[j]].push([ts1 + 86400000, 0]);
        }
      }
    }

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
          if (e.min !== START_PIE || e.max !== END_PIE) {
            START_PIE = e.min;
            END_PIE = e.max;
            Session.set("UPDATE_PIE", e.min + e.max);
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
          if (!SINGLEGRAPH_RENDERED) {
            START_PIE = event.currentTarget.axes[0].userMin;
            END_PIE = event.currentTarget.axes[0].userMax;
            Session.set("UPDATE_PIE", event.currentTarget.axes[0].userMin);
            SINGLEGRAPH_RENDERED = true;
          }
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
    series:buildSeries(tags, line_data)
  });

  // Update the pie series
  updatePieSeries();
}

/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.singleGraphs.rendered = function ()  {
  renderGraph();

  $('#static_location').on('change', function() {
    renderGraph();
  });

  Deps.autorun(function () {
    var update = Session.get("UPDATE_PIE");
    updatePieSeries();
  });
}