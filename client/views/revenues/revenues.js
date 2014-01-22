// Variable declarations
var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

function renderGraph(start_month, start_year, end_month, end_year) {

  if (start_month !== '' && start_year !== '' && end_month !== '' && end_year !== '') {

    // Calculate timestamps
    var start_timestamp = Number(moment("01-"+start_month+"-"+start_year+" 09:00", "DD-MM-YYYY HH:mm").unix() * 1000);
    var end_timestamp = Number(moment("01-"+end_month+"-"+end_year+" 20:00", "DD-MM-YYYY HH:mm").unix() * 1000);

    // Initialize arrays
    var data = new Array();
    var labels = new Array();

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
      if (doc && doc.revenuebarge) {
        data.push(Number(doc.revenuebarge));
      } else {
        data.push(0);
      }

      // update the counter
      month++;
      if (month > MONTHS.length) {
        month = 1;
        year++;
      }
    }

    // Build the dataset
    var data = {
      labels : labels,
      datasets : [
        {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data : data
        },
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : data
        }
      ]
    }

    //Get the context of the canvas element we want to select
    var ctx = document.getElementById("chart").getContext("2d");

    new Chart(ctx).Line(data, null);
  }
}


/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.revenues.rendered=function() {
  // Auto update when data changed
  var start_year = '';
  var start_month = '';
  var end_year = '';
  var end_month = '';

  $("#start_year").change(function() {
    start_year = this.value;
    renderGraph(start_month, start_year, end_month, end_year);
  });
  $("#start_month").change(function() {
    start_month = this.value;
    renderGraph(start_month, start_year, end_month, end_year);
  });
  $("#end_year").change(function() {
    end_year = this.value;
    renderGraph(start_month, start_year, end_month, end_year);
  });
  $("#end_month").change(function() {
    end_month = this.value;
    renderGraph(start_month, start_year, end_month, end_year);
  });


  

}