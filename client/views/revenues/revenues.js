// Variable declarations
var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var IGNORED_TAGS = ["_id","location","timestamp"];
var DEFAULT_COLORS = ["220,0,0","0,220,0","0,0,220","220,220,0","0,220,220","220,0,220","110,0,0","0,110,0","0,0,110","110,110,0","0,110,110","110,0,110"];
var DEFAULT_COLORS_HEX = ["#DC0000","#00DC00","#0000DC","#DCDC00","#00DCDC","#DC00DC","#6E0000","#006E00","#00006E","#6E6E00","#006E6E","#6E006E"];

/*****************************************************************************
 * General Template function
 *****************************************************************************/

Template.revenues.tags = function() {
  return getTags();
}

/*****************************************************************************
 * General function
 *****************************************************************************/

function buildCanvas() {
  var chart_type = document.getElementById('chart_type');
  var chart_display = document.getElementById('chartDisplay');

  if (chart_type && chart_type.value === "Pie") {
    var tags = getTags();
    var inner_html = "";

    for (var i=0;i<tags.length;i++) {
      if ($('#'+tags[i]).attr('checked')) {
        inner_html += "<div class='pie'><canvas class='chart' id='chart_" + tags[i] + "' width='200px' height='200px'></canvas><p>" + tags[i] + "</p></div>";
      }
    }

    chart_display.innerHTML = inner_html;
  } else if (chart_display) {
    chart_display.innerHTML = "<canvas class='chart' id='chart' width='800px' height='200px'></canvas>";
  }
}

function monthDifference(d1, d2) {
    var months;
    months = (moment(d2).year() - moment(d1).year()) * 12;
    months -= moment(d1).month();
    months += moment(d2).month() + 1;
    return months <= 0 ? 0 : months;
}

function getTags() {
  var doc = Customerservice.findOne();
  var tags = new Array();

  // Get the field tags
  for(var name in doc) {
    var ignore = false;
    for(var i=0;i<IGNORED_TAGS.length;i++) {
      if (IGNORED_TAGS[i] === name) { ignore = true; }
    }
    if (!ignore)
      tags.push(name);
  }

  return tags;
}

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

function renderGraph(start_month, start_year, end_month, end_year) {

  if (start_month !== '' && start_year !== '' && end_month !== '' && end_year !== '') {
    // Set up the canvas (for line or bar) or serveral canvasses (for pie)
    buildCanvas();

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
    var start_timestamp = Number(moment("01-"+start_month+"-"+start_year+" 09:00", "DD-MM-YYYY HH:mm").unix() * 1000);
    var end_timestamp = Number(moment("01-"+end_month+"-"+end_year+" 20:00", "DD-MM-YYYY HH:mm").unix() * 1000);

    // Parse each month
    var month_count = monthDifference(start_timestamp, end_timestamp);
    var month = Number(start_month);
    var year = Number(start_year);
    for (var i=0;i<month_count;i++) {

      // Append label
      labels.push(year + " " + MONTHS[month-1]);

      // Append data
      var ts1 = Number(moment("01-"+month+"-"+year+" 09:00", "DD-MM-YYYY HH:mm").unix() * 1000);
      var ts2 = Number(moment("01-"+month+"-"+year+" 20:00", "DD-MM-YYYY HH:mm").unix() * 1000);
      var doc = Customerservice.findOne({timestamp:{$gt:ts1,$lt:ts2}});
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

    if (document.getElementById('chart_type').value === "Pie") {
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


          //Get the context of the canvas element we want to select
          var ctx = document.getElementById("chart_" + tags[i]).getContext("2d");
          // Display the pie
          new Chart(ctx).Doughnut(dataset, null);
        }
      }
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
 * Event functions
 *****************************************************************************/

Template.revenues.events({
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