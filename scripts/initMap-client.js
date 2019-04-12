function initMap() {
  // directionsService = new google.maps.DirectionsService;
  bounds            = new google.maps.LatLngBounds;

  definePopupClass();
  map       = new google.maps.Map(document.getElementById('map'));
  map.setTilt(45)

  // var obj1  = new ResourceObject(position,map, document.getElementById('content'));


  var resourceInit  = new ResourcesManager();
  resourceInit.manageAnimationButton();
  resourceInit.firstInit();

  var socket = new WebSocket("ws://server.traccar.org/api/socket");

  socket.onmessage =  function (event) {

    var parsedData  = JSON.parse(event.data);

    if (parsedData.devices != null){

      resourceInit.statusUpdate(parsedData.devices[0]);
    }

    if (parsedData.positions != null){


      resourceInit.positionUpdate(parsedData.positions[0]);
    }


    console.log(JSON.parse(event.data));
  }

}
