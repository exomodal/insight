// Variable declarations
var LIST_ID;
var LIST_LOCATION;

/*****************************************************************************
 * General Template functions
 *****************************************************************************/

/*
 * This function sets the form id variable based on the URL.
 */
Template.formsList.initialize = function () {
	if (this && this[0]) {
   	LIST_ID = Number(this[0]);
  } else {
   	LIST_ID = -1;
  }
}

/*
 * Get the form id
 */
Template.formsList.formid = function () {
  return LIST_ID;
}

/*
 * Get the form label
 */
Template.formsList.formlabel = function () {
  return form_label(LIST_ID);
}

/*
 * Returns whether the form is location bound.
 * If so the location field should be added.
 */
Template.formsList.isLocationBound = function () {
  return form_isLocationBound(LIST_ID);
}

/*
 * Returns whether the user does have a location.
 */
Template.formsList.isLocalUser = function () {
  return user_isLocal();
}

/*
 * Returns the location of the current user.
 */
Template.formsList.userlocation = function () {
  return user_location();
}

/*
 * Get the list of locations
 */
Template.formsList.location = function () {
  return config_locations();
}

/*****************************************************************************
 * General function
 *****************************************************************************/

function renderList() {
  var form = form_get(LIST_ID);
  if (form && form.name) {
    var selector = {};

    // If the form is location bound we add the location to the find query
    if (form_isLocationBound(LIST_ID)) {
      var location = $('#static_location').val();
      selector = {location:Number(location)};
    }

    // Get the entries from the collection
    var cursor = collection_find(form.name, selector, {sort:{timestamp:-1}});
    var inner_html = "";

    // Add each entry to the display list
    cursor.forEach(function (entry) {
      inner_html += '<div class="row body">';
      inner_html += '<div class="cell"><span>' + toYear(entry.timestamp) + '&nbsp;</span></div>';
      inner_html += '<div class="cell"><span>' + toMonth(entry.timestamp) + '&nbsp;</span></div>';
      inner_html += '<div class="cell"><div class="status ' + isComplete(entry) + '">&nbsp;</div></div>';
      inner_html += '<div class="cell"><span>Unknown&nbsp;</span></div>';
      inner_html += '<div class="cell">';
      inner_html += '<button onclick="location.href=\'/entry/' + LIST_ID + '/' + entry._id + '\'" class="btn btn-info btn-lg editButton"><i class="icon-edit icon-white"></i></button>';
      inner_html += '</div>';
      inner_html += '</div>';
    });

    // Display the list
    $('#body').html(inner_html);
  }
  return undefined;
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
 * Check whether all fields are filled.
 * If all fields are filled it returns complete else incomplete.
 */
function isComplete(entry) {
  var form = form_get(LIST_ID);
  if (form && form.fields) {

    // Parse each field
    for (var i=0;i<form.fields.length;i++) {
      // Parse each input
      for (var j=0;j<form.fields[i].inputs.length;j++) {
        if (!entry[form.fields[i].inputs[j].name] || entry[form.fields[i].inputs[j].name] === "") {
          return "incomplete";
        }
      }
    }
  }
  return "complete";
}

/*****************************************************************************
 * Template rendered function
 *****************************************************************************/

Template.formsList.rendered = function() {
  // Set the onChange function for the location selector
  $('#static_location').on('change', function(evt) {
    renderList();
  });

  // Render the list
  renderList();
}