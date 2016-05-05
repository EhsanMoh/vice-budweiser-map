var geocoder;
var output = [];
var delay = 100;
var counter = 0;

function getCoordinatesForRow(rows) {
  if (rows.length == 0) {
    $('#cursor').text(counter++);
    alert('All done!');
    $('#go').text('Complete');
    return;
  }
  $('#throttle').text('Throttling '+ delay/1000 +' seconds per request');
  var row = rows.pop();
  geocoder.geocode( { 'address': row[1]}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      row.push(results[0].geometry.location.lat());
      row.push(results[0].geometry.location.lng());
      output.push(row);
      $('#output').text(Papa.unparse(output));
      $('#cursor').text(counter++);

      // Reset fallback
      delay = 100;
      // Proceed with remaining list
      window.setTimeout(function() { getCoordinatesForRow(rows) }, delay);
    } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      // Exponential fallback
      delay = delay * 2;
      // Reattempt address
      rows.push(row);
      window.setTimeout(function() { getCoordinatesForRow(rows) }, delay);
    } else {
      $("#error").append('<li><strong>Bad geocode:</strong> '+status+' for '+row[1]+'</li>');
      // Keep going with no penalty
      $('#cursor').text(counter++);
      window.setTimeout(function() { getCoordinatesForRow(rows) }, delay);
    }
  });
}

$( document ).ready(function() {
  geocoder = new google.maps.Geocoder();

  $('#go').on('click', function() {
    if ($(this).attr('disabled') == 'disabled') {
      alert('Already processing!');
      return;
    }
    $(this).attr('disabled', 'disabled');
    $(this).text('Processing...');

    var csv = $('#input').val();
    var results = Papa.parse(csv.trim());

    $('#total').text(results.data.length - 1);
    $('#processing').show();

    if (results.errors.length > 0) {
      alert(results.errors.length + " errors trying to parse CSV");
      console.log("Errors parsing CSV: ");
      console.log(results.errors);
      var htmlErrors = '';
      for (var i = results.errors.length - 1; i >= 0; i--) {
        htmlErrors += '<li><strong>' + results.errors[i].code + ':</strong> ' + results.errors[i].message + '</li>';
      }
      $('#error').html(htmlErrors);
      return;
    }

    var newHeader = results.data[0];
    newHeader.push('Latitude');
    newHeader.push('Longitude');
    output.push(newHeader);


    // Ignore header
    getCoordinatesForRow(results.data.slice(1));
  });
});
