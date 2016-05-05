var map, data;

google.maps.event.addDomListener(window, 'load', function() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(51.84064965524485, -96.79628700410154),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var panelDiv = document.getElementById('panel');

  data = new BudDataSource;

  var view = new storeLocator.View(map, data, {
    geolocation: true,
    features: data.getFeatures(),
    sidebarOffset: 150
  });

  new storeLocator.Panel(panelDiv, {
    view: view,
    locationSearchLabel: '',
    sidebarOffset: 150
  });
});

google.maps.event.addDomListener(window, 'resize', function() {
  google.maps.event.trigger(map, "resize");
});

