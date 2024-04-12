function initialize() {
  var myLatlng1 = new google.maps.LatLng(53.65914, 0.072050);

  var mapOptions = {
      zoom: 10,
      center: myLatlng1,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('map'),
  mapOptions);

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(initialLocation);
      });
  }
}