// Variable declarations
var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var DEFAULT_COLORS = ["220,0,0","0,220,0","0,0,220","220,220,0","0,220,220","220,0,220","110,0,0","0,110,0","0,0,110","110,110,0","0,110,110","110,0,110"];
var DEFAULT_COLORS_HEX = ["#DC0000","#00DC00","#0000DC","#DCDC00","#00DCDC","#DC00DC","#6E0000","#006E00","#00006E","#6E6E00","#006E6E","#6E006E"];

var SINGLEGRAPH_COLLECTION;
var SINGLEGRAPH_IGNORE_TAGS;

/*****************************************************************************
 * General Template function
 *****************************************************************************/

/*
 * This function will initialize the default variables
 * which should be located in the 'this.data' variable.
 */
Template.singleGraphs.initialize = function() {
  // Check if the data is available
  if (this.data && this.data.collection && this.data.ignore) {
    SINGLEGRAPH_COLLECTION = this.data.collection;
    SINGLEGRAPH_IGNORE_TAGS = this.data.ignore;

  // If the data is not available we throw an error
  } else {
    SINGLEGRAPH_COLLECTION = undefined;
    SINGLEGRAPH_IGNORE_TAGS = undefined;
    throwError("The graphs are not correctly initialized! Please contact the administrator.");
  }
}

/*
 * This function will return all available tags.
 */
Template.singleGraphs.tags = function() {
  return getTags();
}

/*****************************************************************************
 * Collection function
 *****************************************************************************/

/*
 * This function will execute the findOne query onto the
 * correct collection.
 */
function findOne(obj) {
  // If object is undefined construct an empty query
  if (!obj) { obj = {}; }

  // Do a findOne onto the correct collection
  if (SINGLEGRAPH_COLLECTION === "management") {
    return Management.findOne(obj);
  } else if (SINGLEGRAPH_COLLECTION === "customerservice") {
    return Customerservice.findOne(obj);
  } else if (SINGLEGRAPH_COLLECTION === "intermodalplanning") {
    return Intermodalplanning.findOne(obj);
  } else if (SINGLEGRAPH_COLLECTION === "truckplanning") {
    return Truckplanning.findOne(obj);
  } else if (SINGLEGRAPH_COLLECTION === "terminalmanager") {
    return TerminalManager.findOne(obj);
  }

  // Did not found the initialized collection
  throwError("The initialized collection does not exist! Please contact the administrator.");
}

/*****************************************************************************
 * General function
 *****************************************************************************/

/*
 * This function constructs the canvas divs.
 * For a Line and Bar chart we only need one canvas, for
 * a Pie chart we need serveral canvasses.
 */
function initializeCanvas() {
  // Get the selected chart type and the chart display div
  var chart_type = document.getElementById('chart_type');
  var chart_display = document.getElementById('chartDisplay');

  // If the Pie chart is selected construct serveral canvasses
  if (chart_type && chart_type.value === "Pie") {
    var tags = getTags();
    var inner_html = "";

    // Construct a canvas for each tag which is checked in the filter
    for (var i=0;i<tags.length;i++) {
      if ($('#'+tags[i]).attr('checked')) {
        inner_html += "<div class='pie'><canvas class='chart' id='chart_" + tags[i] + "' width='200px' height='200px'></canvas><p>" + tags[i] + "</p></div>";
      }
    }

    chart_display.innerHTML = inner_html;

  // If a Line or Bar chart is selected we construct a single canvas
  } else if (chart_display) {
    chart_display.innerHTML = "<canvas class='chart' id='chart' width='800px' height='200px'></canvas>";
  }
}

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
 * This function returns all available variable tags
 * from a collection document.
 */
function getTags() {
  var tags = new Array();

  // Get one document
  var doc = findOne();

  // Parse each tag in the document
  for(var name in doc) {
    // Check if the tag is also in the ignored tags list.
    // If so, we set the ignore boolean on true.
    var ignore = false;
    for(var i=0;i<SINGLEGRAPH_IGNORE_TAGS.length;i++) {
      if (SINGLEGRAPH_IGNORE_TAGS[i] === name) { ignore = true; }
    }

    // If we should not ignore the tag, add it to the tags array
    if (!ignore)
      tags.push(name);
  }

  return tags;
}

/*
 * This function build the datasets for the Line and Bar charts based
 * on the given tags and data.
 */
function buildDataset(tags, data) {
  var datasets = new Array();

  for (var i=0;i<tags.length;i++) {
    if ($('#'+tags[i]).attr('checked')) {
      var lightness = "0.0";
      if (document.getElementById('chart_type').value === "Bar")
        lightness = "0.5"

      datasets.push(
        {
          fillColor : "rgba(" + DEFAULT_COLORS[i] + "," + lightness + ")",
          strokeColor : "rgba(" + DEFAULT_COLORS[i] + ",1)",
          pointColor : "rgba(" + DEFAULT_COLORS[i] + ",1)",
          pointStrokeColor : "#fff",
          data : data[tags[i]]
        });
    }
  }

  return datasets;
}

/*
 * This function handles the complete constuction and displaying
 * of the charts based on the filter input.
 */
function renderGraph(start_month, start_year, end_month, end_year) {

  // All filter input should be set
  if (start_month !== '' && start_year !== '' && end_month !== '' && end_year !== '') {

    // Initialize the canvas(ses)
    initializeCanvas();

    // Initialize arrays
    var data = new Object();
    var labels = new Array();
    var tags = getTags();
    for (var i=0;i<tags.length;i++) {
      if ($('#'+tags[i]).attr('checked')) {
        data[tags[i]] = new Array();
      }
    }

    // Calculate timestamps
    var start_timestamp = Number(moment("01-"+start_month+"-"+start_year+" 00:00", "DD-MM-YYYY HH:mm").unix() * 1000);
    var end_timestamp = Number(moment("28-"+end_month+"-"+end_year+" 23:00", "DD-MM-YYYY HH:mm").unix() * 1000);

    // Parse each month
    var month_count = monthDifference(start_timestamp, end_timestamp);
    var month = Number(start_month);
    var year = Number(start_year);
    for (var i=0;i<month_count;i++) {

      // Append label
      labels.push(year + " " + MONTHS[month-1]);

      // Append data
      var ts1 = Number(moment("01-"+month+"-"+year+" 00:00", "DD-MM-YYYY HH:mm").unix() * 1000);
      var ts2 = Number(moment("28-"+month+"-"+year+" 23:00", "DD-MM-YYYY HH:mm").unix() * 1000);
      var doc = findOne({timestamp:{$gt:ts1,$lt:ts2}});
      for (var j=0;j<tags.length;j++) {
        if ($('#'+tags[j]).attr('checked')) {
          if (doc && doc[tags[j]]) {
            data[tags[j]].push(Number(doc[tags[j]]));
          } else {
            data[tags[j]].push(0);
          }
        }
      }

      // update the counter
      month++;
      if (month > MONTHS.length) {
        month = 1;
        year++;
      }
    }

    // Now we have all data and labels so we can display the chart
    // A Pie chart uses difference datasets
    if (document.getElementById('chart_type').value === "Pie") {

      // Create one Pie for each checked tag in the filter
      for (var i=0;i<tags.length;i++) {
        if ($('#'+tags[i]).attr('checked')) {

          // Build the dataset
          var dataset = new Array();
          var data_tag = data[tags[i]];
          for (var j=0;j<data_tag.length;j++) {
            dataset.push({
              value: data_tag[j],
              color: DEFAULT_COLORS_HEX[j]
            });
          }

          //Get the context of the canvas element we want to select and display the pie
          var ctx = document.getElementById("chart_" + tags[i]).getContext("2d");
          new Chart(ctx).Doughnut(dataset, null);
        }
      }

    // The Line and Bar chart uses the same dataset
    } else {

      // Build the dataset
      var data = {
        labels : labels,
        datasets : buildDataset(tags, data)
      };

      //Get the context of the canvas element we want to select
      var ctx = document.getElementById("chart").getContext("2d");

      // Display the bar or line
      if (document.getElementById('chart_type').value === "Bar") {
        new Chart(ctx).Bar(data, null);
      } else { 
        new Chart(ctx).Line(data, null);
      }
    }
  }
}

/*****************************************************************************
 * Template Event functions
 *****************************************************************************/

/*
 * This function contains all event handlers.
 */
Template.singleGraphs.events({
  /*
   * Executed when clicking the Submit button
   */
  'click .submit':function(e) {

    var start_year = document.getElementById('start_year').value;
    var start_month = document.getElementById('start_month').value;
    var end_year = document.getElementById('end_year').value;
    var end_month = document.getElementById('end_month').value;

    renderGraph(start_month, start_year, end_month, end_year);
  }
});