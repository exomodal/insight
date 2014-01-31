// Variable declarations
var PERFORMANCE_TAGS;
var PERFORMANCE_START_MONTH = 1;
var PERFORMANCE_START_YEAR = 2008;


/*****************************************************************************
 * Variable function
 *****************************************************************************/

/*
 * This function will set the tags variable for the
 * current graph. This is necessary because this template could
 * be loaded serveral times in one page which will overwrite
 * its data.
 */
function setVariables(parent) {
  // Check if the data is available
  if (parent.data) {
    PERFORMANCE_TAGS = parent.data;

  // If the data is not available we throw an error
  } else {
    PERFORMANCE_TAGS = undefined;
    throwError("The graphs are not correctly initialized! Please contact the administrator.");
  }
}

/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the default variables
 * which should be located in the 'this.data' variable.
 */
Template.performanceGraphs.initialize = function() {
  // First set the variables
  setVariables(this);

  // Now return a div which will display the graph
  // The graph name is added to be sure the graph is not duplicated
  // and will not be overwritten by other graph data
  if (this.data) {
    return '<div class="chartContainer' + PERFORMANCE_TAGS.name + '"></div>';
  } else {
    return '';
  }
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
 * Convert timestamp into year.
 */
function toYear(timestamp) {
  if (timestamp && timestamp !== 0)
    return moment.unix(timestamp/1000).year();
  return "";
}

/*
 * Convert timestamp into month.
 */
function toMonth(timestamp) {
  if (timestamp && timestamp !== 0)
    return GLOBAL_MONTHS[moment.unix(timestamp/1000).month()];
  return "";
}

/*
 * This function constructs the datasets.
 */
function buildSeries(line_data) {
  var datasets = new Array();

  // Build the datasets for line and bar graphs
  for (var i=0;i<PERFORMANCE_TAGS.graphs.length;i++) {
    if (PERFORMANCE_TAGS.graphs[i].locationbound) {
      var locations = config_locations();
      for (var j=0;j<locations.length;j++) {
        datasets.push(
          {
            type:PERFORMANCE_TAGS.graphs[i].type,
            name:PERFORMANCE_TAGS.graphs[i].label + " " + locations[j].name,
            data:line_data[PERFORMANCE_TAGS.graphs[i].label + " " + locations[j].name],
            tooltip:{valueDecimals:2},
          });
      }
    } else {
      datasets.push(
        {
          type:PERFORMANCE_TAGS.graphs[i].type,
          name:PERFORMANCE_TAGS.graphs[i].label,
          data:line_data[PERFORMANCE_TAGS.graphs[i].label],
          tooltip:{valueDecimals:2}
        });
    }
  }

  return datasets;
}

function countValues(doc, names, pre) {
  var total = 0;

  for (var k=0;k<names.length;k++) {
    if (doc && doc[names[k]]) {
      total += Number(doc[names[k]]);
    }
  }

  if (pre) {
    total = total * pre;
  }

  return total;
}

/*
 * This function handles the complete constuction and displaying of the charts.
 */
function renderGraph() {
  // Initialize arrays
  var line_data = new Object();

  for (var i=0;i<PERFORMANCE_TAGS.graphs.length;i++) {
    if (PERFORMANCE_TAGS.graphs[i].locationbound) {
      var locations = config_locations();
      for (var j=0;j<locations.length;j++) {
        line_data[PERFORMANCE_TAGS.graphs[i].label + " " + locations[j].name] = new Array();
      }
    } else {
      line_data[PERFORMANCE_TAGS.graphs[i].label] = new Array();
    }
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

    for (var m=0;m<PERFORMANCE_TAGS.graphs.length;m++) {
      if (PERFORMANCE_TAGS.graphs[m].locationbound) {

        var locations = config_locations();
        for (var k=0;k<locations.length;k++) {
          var totalCount = 0;
          var totalSplit = 0;

          // Count all tag values of every form
          for (var j=0;j<PERFORMANCE_TAGS.graphs[m].count.length;j++) {
            var doc = collection_findOne(form_name(PERFORMANCE_TAGS.graphs[m].count[j].form), {location:Number(locations[k].id), timestamp:{$gt:ts1,$lt:ts2}});
            totalCount += countValues(doc, PERFORMANCE_TAGS.graphs[m].count[j].names, PERFORMANCE_TAGS.graphs[m].count[j].pre);
          }

          // Count all tag values of every form
          for (var j=0;j<PERFORMANCE_TAGS.graphs[m].split.length;j++) {
            var doc = collection_findOne(form_name(PERFORMANCE_TAGS.graphs[m].split[j].form), {location:Number(locations[k].id), timestamp:{$gt:ts1,$lt:ts2}});
            totalSplit += countValues(doc, PERFORMANCE_TAGS.graphs[m].split[j].names, PERFORMANCE_TAGS.graphs[m].split[j].pre);
          }

          // Split if posible
          if (totalSplit > 0) {
            totalCount = totalCount / totalSplit;
          }

          line_data[PERFORMANCE_TAGS.graphs[m].label + " " + locations[k].name].push([ts1 + 86400000, totalCount]);
        }
      } else {
        var totalCount = 0;
        var totalSplit = 0;

        // Count all tag values of every form
        for (var j=0;j<PERFORMANCE_TAGS.graphs[m].count.length;j++) {
          // If one of the forms is location bound
          if (form_isLocationBound(PERFORMANCE_TAGS.graphs[m].count[j].form)) {
            var locations = config_locations();
            for (var l=0;l<locations.length;l++) {
              var doc = collection_findOne(form_name(PERFORMANCE_TAGS.graphs[m].count[j].form), {location:Number(locations[l].id), timestamp:{$gt:ts1,$lt:ts2}});
              totalCount += countValues(doc, PERFORMANCE_TAGS.graphs[m].count[j].names, PERFORMANCE_TAGS.graphs[m].count[j].pre);
            }
          // Else we do not need to parse each location
          } else {
            var doc = collection_findOne(form_name(PERFORMANCE_TAGS.graphs[m].count[j].form), {timestamp:{$gt:ts1,$lt:ts2}});
            totalCount += countValues(doc, PERFORMANCE_TAGS.graphs[m].count[j].names, PERFORMANCE_TAGS.graphs[m].count[j].pre);          }
        }

        // Count all tag values of every form
        for (var j=0;j<PERFORMANCE_TAGS.graphs[m].split.length;j++) {
          // If one of the forms is location bound
          if (form_isLocationBound(PERFORMANCE_TAGS.graphs[m].split[j].form)) {
            var locations = config_locations();
            for (var l=0;l<locations.length;l++) {
              var doc = collection_findOne(form_name(PERFORMANCE_TAGS.graphs[m].split[j].form), {location:Number(locations[l].id), timestamp:{$gt:ts1,$lt:ts2}});
              totalSplit += countValues(doc, PERFORMANCE_TAGS.graphs[m].split[j].names, PERFORMANCE_TAGS.graphs[m].split[j].pre);
            }
          // Else we do not need to parse each location
          } else {
            var doc = collection_findOne(form_name(PERFORMANCE_TAGS.graphs[m].split[j].form), {timestamp:{$gt:ts1,$lt:ts2}});
            totalSplit += countValues(doc, PERFORMANCE_TAGS.graphs[m].split[j].names, PERFORMANCE_TAGS.graphs[m].split[j].pre);
          }
        }

        // Split if posible
        if (totalSplit > 0) {
          totalCount = totalCount / totalSplit;
        }

        line_data[PERFORMANCE_TAGS.graphs[m].label].push([ts1 + 86400000, totalCount]);
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
  $('.chartContainer' + PERFORMANCE_TAGS.name).highcharts('StockChart', {
    rangeSelector: {selected:5,inputDateFormat:'%b %Y',inputEditDateFormat:'%b %Y'},
    xAxis:{gridLineWidth:1,type:'datetime',tickInterval:30*24*3600000,labels:{formatter:function() {return Highcharts.dateFormat("%b %Y", this.value);}}},
    title: {text:PERFORMANCE_TAGS.label},
    legend: {enabled:true},
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} ' + PERFORMANCE_TAGS.unit + '</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    series:buildSeries(line_data)
  });
}

/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.performanceGraphs.rendered = function ()  {
  // Set the variables
  setVariables(this.data);

  // Render the graph
  renderGraph();
}