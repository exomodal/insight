// Variable declarations
var SINGLEGRAPH_FORM;
var SINGLEGRAPH_IGNORE_TAGS;

var START_MONTH = 1;
var START_YEAR = 2008;

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

  // If the data is not available we throw an error
  } else {
    SINGLEGRAPH_FORM = undefined;
    SINGLEGRAPH_IGNORE_TAGS = undefined;
    throwError("The graphs are not correctly initialized! Please contact the administrator.");
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
 * This function build the datasets.
 */
function buildDataset(tags, line_data, pie_data) {
  var datasets = new Array();

  for (var i=0;i<tags.length;i++) {
    datasets.push(
      {
        name:tags[i],
        data:line_data[tags[i]],
        tooltip:{valueDecimals:2},
      });
  }

  var xAxis = 100;
  for (var i=0;i<tags.length;i++) {
    datasets.push({
      type:'pie',
      name:tags[i],
      data: pie_data[tags[i]],
      center: [xAxis, 30],
      size:100,
      showInLegend:false,
      dataLabels: {
        enabled: false
      }
    });

    xAxis += 110;
  }

  return datasets;
}

/*
 * This function handles the complete constuction and displaying of the charts.
 */
function renderGraph() {
  // Initialize arrays
  var line_data = new Object();
  var pie_data = new Object();
  var tags = form_tags(SINGLEGRAPH_FORM);
  for (var i=0;i<tags.length;i++) {
    line_data[tags[i]] = new Array();
    pie_data[tags[i]] = new Array();
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

    var doc = collection_findOne(form_name(SINGLEGRAPH_FORM), {timestamp:{$gt:ts1,$lt:ts2}});
    for (var j=0;j<tags.length;j++) {
      if (doc && doc[tags[j]]) {
        line_data[tags[j]].push([ts1 + 86400000, Number(doc[tags[j]])]);
        pie_data[tags[j]].push([GLOBAL_MONTHS[month-1]+' '+year, Number(doc[tags[j]])]);
      } else {
        line_data[tags[j]].push([ts1 + 86400000, 0]);
        pie_data[tags[j]].push([GLOBAL_MONTHS[month-1]+' '+year, 0]);
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
    xAxis:{type:'datetime',tickInterval:30*24*3600000,labels:{formatter:function() {return Highcharts.dateFormat("%b %Y", this.value);}}},
    title: {text:''},
    legend: {enabled:true},
    chart: {
      events: {
        redraw: function(event) {
          var chart = $('#chartContainer').highcharts();
          console.log(chart.series[0]);
          console.log(event.currentTarget.axes[0].userMin + ", " + event.currentTarget.axes[0].userMax);
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
    series:buildDataset(tags, line_data, pie_data)
  });
}

/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.singleGraphs.rendered = function ()  {
  renderGraph();
}