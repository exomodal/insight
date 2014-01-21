
function renderGraph(start_year, end_year) {

  var cursor = Customerservice.find({year:{$gt:Number(start_year)-1,$lt:Number(end_year)+1}});
  var data = new Array();

  cursor.forEach(function (month) {
    data.push(Number(month.revenuebarge));
  });

  var data = {
    labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
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


/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.revenues.rendered=function() {
  // Auto update when data changed
  var start_year;
  var end_year;

  $("#start_year").change(function() {
    start_year = this.value;
  });
  $("#end_year").change(function() {
    end_year = this.value;

    renderGraph(start_year, end_year);
  });


  

}