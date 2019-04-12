
class Resources{

  constructor(obj){

    this.map               =   map;
    this.id                =   obj.id;
    this.profilePics       =   obj.profilePics;
    this.lastPosition      =   [];
    this.status            =   obj.status;
    this.plateNumber       =   obj.plateNumber;
    this.driverName        =   obj.driverName;
    this.address           =   obj.address;
    this.latLng            =   obj.latLng;
    this.marker            =   obj.marker;
    this.resourceId        =   obj.resourceId;
    this.to                =   obj.to;
    this.from              =   obj.from;
    this.orderPickUpPoint  =   obj.orderPickUpPoint;
    this.orderDeliveryPoint=   obj.orderDeliveryPoint;
    this.orderStartDate    =   obj.orderStartDate;
    this.popup             =   '';
    this._focus            =   false;
    this.polyLine          =   '';
    this.icon              =   '';
    this.path              =   '';
    this.zoomLevel         =   7;
    this.count             =  '';
    this.circle            =  '';
    this.directionPath     =   [];
    this.lastPathIndex     =   0;
    this.nextPathIndex     =   1;
    this.speed             =  '';
    this.infowindow        =   '';
    this.interpolatedPath  =   [];
    this.lastStatus        =  {};
    this.tileBackgroundColor  = 'white';
    this.polyLineColor     =  '#FF0000';
    this.polyLineToCompleteColor = 'black';
    this.zoomed                   =   false;
    this.historyPolyLineSwitch    =   false;
    this.toCompletePolyLineSwitch =   false;
    this.trackResourceOrder       =   false;
    this.bounds                   =   new google.maps.LatLngBounds();
    this.directionRenderer        =   new google.maps.DirectionsRenderer();
    this.deliveryPointInfoWindow  =   new google.maps.InfoWindow();
    this.pickupPointInfoWindow    =   new google.maps.InfoWindow();
    this.resourceSwitch           =   true;
    this.timeToDeliver            =   '';
    this.timeToPickup             =   '';
    this.directionServiceMarker = [];
    this.createMarker();
    this.setMap();
    this.initMarkers();
    this.animateHistory();
    this.onMarkerClick();
    this.onZoomClick();
    this.polyLineSettings();
    this.resourceSettings();
    this.polyLineSwitchSettings();
    this.polyLineColorSwitchSettings();
    this.trailOrder();
    this.toCompleteLine    =  new google.maps.Polyline({
      strokeColor: this.polyLineToCompleteColor,
      strokeOpacity: 0.4,
      strokeWeight: 5,
      geodesic: true, //set to false if you want straight line instead of arc
    });

    this.circle            = new google.maps.Circle({

      strokeColor: '#F9A81A',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#F9A81A',
      fillOpacity: 0.35,
      center: new google.maps.LatLng(this.latLng),
      radius: 50000,
    });


  }

  set deliveryPointInfoWindowContent(content){

    this.deliveryPointInfoWindow.setContent(content);

  }

  set pickupMarkerInfoWindowContent(content){

    this.pickupPointInfoWindow.setContent(content);

  }

  set position(position){

    //Update the address of the
    var oldLatLng         = this.latLng;
    this.latLng           = {lat:position.latitude,lng:position.longitude};
    var _self             = this;
    this.newLivePosition  = this.latLng;
    this.lastLivePosition = oldLatLng;

    this.geoCodePosition(this.latLng, (data)=> {
      this.address     = data;
      this.speed       = '';
      var moved        = [];

      moved.push(new google.maps.LatLng(oldLatLng));
      moved.push(new google.maps.LatLng(this.latLng));

      _self.path.concat(this.latLng);

      // if ( _self.directionPath.length > 1){
      //    _self.directionPath.concat(this.latLng);
      // }

      if(this.trackResourceOrder){
        this.liveTrackingLogic(new google.maps.LatLng(this.latLng));
      }

      this.liveDirectionService(function (data) {
        console.log(data,'live direction service');
        if (data != false){
          _self.animateMovementPolyLine(data,100);
        }
      })
    });

    //Update Marker Position
    // this.marker.setPosition(this.latLng);

  }

  set update(status){

    var self              =   this;

    switch (status) {
      case 'online':
        self.online();
        break;
      case 'offline':
        self.offline();
        break;
    }

  }

  set makeActiveTab(content){

    Array.from(initObj).forEach((element)=>{
      element.isActiveResource = false;
    })
    this.isActiveResource      = true;
  }

  online(){

    $('#status_signal_'+this.resourceId).removeClass('status-btn-offline').addClass('status-btn-online');

  }

  offline(){

    $('#status_signal_'+this.resourceId).removeClass('status-btn-online').addClass('status-btn-offline');

  }

  geoCodePosition(postion,callback){

    var geoCoder            =   new google.maps.Geocoder;

    if (postion != null) {

      geoCoder.geocode({
        'location': {lat:postion.lat, lng:postion.lng}
      },function (data) {
        callback(data);
      });

    }

  }

  setMap(){

    this.line                 = new google.maps.Polyline({
      strokeColor: this.polyLineColor,
      strokeOpacity: 0.8,
      strokeWeight: 5,
      geodesic: true, //set to false if you want straight line instead of arc

    });
    this.line.setMap(map);


  }

  initMarkers(){

    this.startMarker = new google.maps.Marker({label:{
        color: 'white',
        fontSize:'17px',
        fontWeight:'bold',
        text:'A'

      }

    });
    this.endMarker   = new google.maps.Marker({label: {
        color: 'white', fontSize: '17px', fontWeight: 'bold', text: 'B'
      }
    });

    this.pickupMarker = new google.maps.Marker({label: {
        color: 'white', fontSize: '17px', fontWeight: 'bold', text: 'P'
      }
    });

    this.deliveryPointMarker = new google.maps.Marker({label: {
        color: 'white', fontSize: '17px', fontWeight: 'bold', text: 'D'
      }
    });

    this.pickupMarker.addListener('click',()=>{

      this.pickupPointInfoWindow.open(map,this.pickupMarker);
      // this.pickupPointInfoWindow.setContent(this.pickupMarkerInfoWindowContent);

    });

    this.deliveryPointMarker.addListener('click',()=>{

      this.deliveryPointInfoWindow.open(map,this.deliveryPointMarker);

      // this.deliveryPointInfoWindow.setContent(this.deliveryPointInfoWindowContent);

    });

  }

  createTile() {
    let status;
    if (this.address != undefined) {
      var address = this.address[0].formatted_address;
    } else {
      var address = 'Not available'
    }

    let switchButton = '';

    if (this.resourceSwitch) {
      switchButton = 'checked';
    }

    if (this.status == 'online'){
      status = 'status-btn-online';
    }else{
      status = 'status-btn-offline';
    }

    let tileHtml = '<div class="driver-tile" id="driverTile_'+this.resourceId+'" style="background : '+this.tileBackgroundColor+'"><div class="btn-group  map-menu "><span class="dropdown-toggle" data-toggle="dropdown"><i class="fas fa-ellipsis-v"></i></span> <ul class="dropdown-menu pull-right"><li> <a href="javascript:;"> <label class="custom-switch"><input type="checkbox" '+switchButton+' id="resourceSettings_'+this.resourceId+'"><span class="custom-slider"></span></label> </a></li><li><a href="javascript:;" id="poly-line_'+this.resourceId+'"><i class="fas fa-bezier-curve"></i> poly-lines</a></li></ul> </div> <div class="flex-container flex-vertical-align col88 padding-0" id="resource_container_'+this.resourceId+'"><div class="col22 " style="padding-left: 12px;position:relative"><span class="status-btn '+status+'" id="status_signal_'+this.resourceId+'"><i class="fas fa-dot-circle"></i></span><div class="map-img-container"><img src="'+this.profilePics+'" style="width: 50px;"></div></div><div class="col88" style="padding-left: 0px;"><p class="f-paragraph bold padding-0 margin-0" style="font-size: 14px;">'+this.driverName+'</p><p class="f-paragraph bold padding-0 margin-0" style="font-size: 12px;">'+address+'</p><p class="f-paragraph bold padding-0 margin-0" style="font-size: 10px;">'+this.plateNumber+'</p><div> <a id="trackOrder_'+this.resourceId+'"  style="text-decoration: underline;" data-toggle="modal" href="#showHistory">track order</a></div><div> </div></div></div></div>';
    $('.active-tile').append(tileHtml);
  }

  createMarker() {

    var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";

    var icon = {

      path: car,
      scale: .7,
      strokeColor: 'white',
      strokeWeight: .10,
      fillOpacity: 1,
      fillColor: '#404040',
      offset: '5%',
      // rotation: parseInt(heading[i]),
      anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
    };



    // var heading = new google.maps.geometry.spherical.computeHeading( {lat:  6.546344, lng: 3.374804}, {lat:  6.546343, lng: 3.374803});
    // icon.rotation = heading;
    this.marker     = new google.maps.Marker({
      map: map,
      icon: icon
    });
    this.icon       = icon;

  }

  addDirectionalIcons(position,rotation){

    let icon = {

      url:'http://cdn.onlinewebfonts.com/svg/download_439498.png',
      size: new google.maps.Size(20, 32),
      // strokeColor: 'white',
      // strokeWeight: .10,
      // fillOpacity: 1,
      // fillColor: '#404040',
      // offset: '5%',
      rotation:rotation,
      anchor: new google.maps.Point(0, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
    };



    // var heading = new google.maps.geometry.spherical.computeHeading( {lat:  6.546344, lng: 3.374804}, {lat:  6.546343, lng: 3.374803});
    // icon.rotation = heading;
    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      position:position
    });
    this.directionServiceMarker.push(marker);

  }

  directionService(callback){

    // directionsService.route({
    //
    //     origin: this.path[0],
    //     destination: this.path[this.path.length  - 1 ],
    //     travelMode: 'DRIVING'
    //
    // }, (response, status)=> {
    //     // Route the directions and pass the response to a function to create
    //     // markers for each step.
    //     if (status === 'OK') {
    //         console.log(response,'response')
    //         // console.log(response,'response')
    //         // this.directionRenderer.directions = response;
    //         // console.log(_self.directionPath,'direction path');
    //         // showSteps(response, markerArray, stepDisplay, map);
    //         //     console.log(this.directionRenderer.getDirections(),'directionRenderer')
    //         callback(response.routes[0].overview_path);
    //     }
    // });


    var _self            = this;

    var direction        = new Promise((resolve,reject) =>{
      var lastIndex        = _self.lastPathIndex;
      var nextIndex        = _self.nextPathIndex;

      if(_self.path[nextIndex] == undefined){
        reject('limit reached')
      }else{
        let latLngPath = [];
        for (var index = 0;index <  this.path.length;index++){
          latLngPath.push(new google.maps.LatLng(this.path[index].lat,this.path[index].lng))
        }
        //make sure the number of steps is not greater that 5 as to prevent query from failing due to too much request

        // let maxSteps         = apiManager.getDistanceFromLatLonInKm(_self.path[0],_self.path[this.path.length - 1])/5;

        // console.log(traccarToGoogleLatLng,'sdsww')
        let maxSteps         =   google.maps.geometry.spherical.computeLength(latLngPath)/5;
        var distance         = apiManager.getDistanceFromLatLonInKm(_self.path[lastIndex],_self.path[nextIndex])

        _self.nextPathIndex   =   nextIndex + 1;

        if ((distance > maxSteps && distance > 0.5) || this.path.length - 1 == nextIndex ){
          console.log(lastIndex,nextIndex,'last path =',this.path.length - 1);
          _self.lastPathIndex   =   nextIndex;

          directionsService.route({

            origin: _self.path[lastIndex],
            destination: _self.path[nextIndex],
            travelMode: 'DRIVING'

          }, (response, status)=> {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            if (status === 'OK') {

              _self.directionPath = _self.directionPath.concat(response.routes[0].overview_path);

              for(var tempBounds = 0; tempBounds < response.routes[0].overview_path.length;tempBounds++) {
                this.bounds.extend(response.routes[0].overview_path[tempBounds]);
              }
              // console.log(response,'response')
              // this.directionRenderer.directions = response;
              // console.log(_self.directionPath,'direction path');
              // showSteps(response, markerArray, stepDisplay, map);
              //     console.log(this.directionRenderer.getDirections(),'directionRenderer')
              resolve('info');
            } else {
              resolve(nextIndex);
              console.log('Directions request failed due to ' + status);
            }
          });
        }else{

          resolve(nextIndex);
        }
      }

    }).then((nextIndex)=>{
      _self.directionService(callback);
    }).catch((reason)=>{
      console.log(reason);
      return callback()

    })


  }

  mimicDirectionService(path,lastPathIndex,nextPathIndex,directionPath,callback){


    let inLastPathIndex = lastPathIndex;
    let inNextPathIndex = nextPathIndex;

    new Promise((resolve,reject)=>{
      console.log(nextPathIndex,path.length,'nexpath,path length');
      if (nextPathIndex > path.length - 1 ) {
        console.log('rejected');
        reject('done');

      }else{//next index to search is always increasing
        inNextPathIndex = nextPathIndex+1;



        //get distance of maximum number of steps that can be taken
        let maxSteps         = apiManager.getDistanceFromLatLonInKm(path[0],path[this.path.length - 1])/5;

        //get distance between the last index and the current index
        let distance         = apiManager.getDistanceFromLatLonInKm(path[lastPathIndex],path[nextPathIndex]);

        //make sure the distance is not greater than the max steps and 0.5 or it equal to the last index in the array
        if ((distance > maxSteps && distance > 0.1) || path.length - 1 == nextPathIndex  ){

          //store the last used index

          inLastPathIndex = nextPathIndex;

          directionsService.route({

            origin      : path[lastPathIndex],
            destination : path[nextPathIndex],
            travelMode  : 'DRIVING'

          }, (response, status)=> {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            if (status === 'OK') {

              directionPath = directionPath.concat(response.routes[0].overview_path);

              // for(var tempBounds = 0; tempBounds < response.routes[0].overview_path.length;tempBounds++) {
              //   this.bounds.extend(response.routes[0].overview_path[tempBounds]);
              // }
              // console.log(response,'response')
              // this.directionRenderer.directions = response;
              // console.log(_self.directionPath,'direction path');
              // showSteps(response, markerArray, stepDisplay, map);
              //     console.log(this.directionRenderer.getDirections(),'directionRenderer')
              let resolvedObj  = {
                inLastPathIndex :   inLastPathIndex,
                inNextPathIndex :   inNextPathIndex,
                directionPath   :   directionPath
              };

              resolve(resolvedObj);

            } else {

              let resolvedObj  = {
                inLastPathIndex :   inLastPathIndex,
                inNextPathIndex :   inNextPathIndex,
                directionPath   :   directionPath
              };

              resolve(resolvedObj);

              console.log('Directions request failed due to ' + status);
            }
          });
        }else{

          let resolvedObj  = {
            inLastPathIndex :   inLastPathIndex,
            inNextPathIndex :   inNextPathIndex,
            directionPath   :   directionPath
          };

          resolve(resolvedObj);
        }
      }



    }).then((resolvedObj)=>{
      console.log('then called');
      this.mimicDirectionService(path,resolvedObj.inLastPathIndex,resolvedObj.inNextPathIndex,directionPath,callback)

    })
      .catch((reason)=>{
        console.log(reason)
        return callback(directionPath);
      })


  }

  liveDirectionService(callback){

    var _self            = this;
    var  now             =  this.newLivePosition;
    var  then            =  this.lastLivePosition;
    var distance         = apiManager.getDistanceFromLatLonInKm(this.lastLivePosition,this.newLivePosition);
    console.log(distance);

    if (distance > 0){

      directionsService.route({

        origin      : then,
        destination : now,
        travelMode: 'DRIVING'

      }, (response, status)=> {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === 'OK') {

          // this.lastLivePosition   =   this.newLivePosition;
          callback(response.routes[0].overview_path);
          // showSteps(response, markerArray, stepDisplay, map);
        } else {
          callback(false);
        }
      });
    }else{

      callback(false);
    }
  }

  interpolate(){

    var numSteps = 100;

    for (var i = 0; i < this.directionPath.length -1 ; i++) {

      for (var steps = 0; steps <= numSteps; steps++) {

        var interpolated  =   google.maps.geometry.spherical.interpolate(this.directionPath[i],this.directionPath[i+1],steps/numSteps);

        this.interpolatedPath.push(interpolated);
      }
    }
  }

  animateMovementPolyLine(moved,speed){

    var limit          = moved.length - 1;
    var _self          = this;
    var lastPosition   = this.marker.getPosition();
    var customBounds   = new google.maps.LatLngBounds();
    let markerPath     = moved;

    (function(i){

      clearInterval(interval);

      interval =  setInterval(()=> {

        i += 1;

        if (i > limit) {
          clearInterval(interval);
        }else{

          var path = _self.line.getPath();

          // Because path is an MVCArray, we can simply append a new coordinate
          // and it will automatically appear.
          var heading = google.maps.geometry.spherical.computeHeading(markerPath[i-1],markerPath[i]);

          path.push(markerPath[i]);

          _self.marker.setPosition(markerPath[i]);
          _self.infowindow.setPosition(markerPath[i]);
          customBounds.extend(markerPath[i]);

          map.panToBounds(customBounds);
          if (_self.isActiveResource){
            map.setCenter(markerPath[i]);
          }
          _self.icon.rotation = heading;
          _self.marker.setIcon(_self.icon);
          lastPosition = _self.marker.getPosition();

        }

      }, 1)

    })(0);

    // this.interval(0,limit,moved);

  }

  animatePolyLine(speed){

    this.interpolate();
    var limit          = this.interpolatedPath.length;
    var _self          = this;
    var lastPosition   = this.marker.getPosition();
    var markerPath     = this.interpolatedPath;
    var customBounds   = new google.maps.LatLngBounds();
    var i              =  0;

    (function(i){

      clearInterval(interval);

      interval =  setInterval(()=> {

        i += 1

        if (i > limit) {
          clearInterval(interval);
        }else{

          var path = _self.line.getPath();

          // Because path is an MVCArray, we can simply append a new coordinate
          // and it will automatically appear.
          var heading = google.maps.geometry.spherical.computeHeading(markerPath[i-1],markerPath[i]);

          path.push(markerPath[i]);

          _self.marker.setPosition(markerPath[i]);
          _self.infowindow.setPosition(markerPath[i]);
          customBounds.extend(markerPath[i]);

          map.panToBounds(customBounds);
          if (_self.isActiveResource){
            map.setCenter(markerPath[i]);
          }

          _self.icon.rotation = heading;
          _self.marker.setIcon(_self.icon);
          lastPosition = _self.marker.getPosition();

        }

      }, 1)

    })(i);
  }

  polyLineSettings(){

    let historypPlineSwitchStatus;
    let toCompletePolyLineSwitchStatus;
    let checked = '';
    let toCompleteChecked = '';
    let _self = this;


    $(document).on('click','#poly-line_'+this.resourceId,function () {

      //Check if polylines have been drawn or if the resource is active
      if (!_self.historyPolyLineSwitch || !_self.resourceSwitch){
        historypPlineSwitchStatus = 'disabled';

      }

      //check if polylines have been drawn and the resource is active
      if (_self.historyPolyLineSwitch && _self.resourceSwitch){

        historypPlineSwitchStatus = '';
      }

      //check if the switch is active
      if (_self.historyPolyLineSwitch){
        checked = 'checked';
      }


      //To be completed path

      //Check if polylines have been drawn or if the resource is active
      if (!_self.toCompletePolyLineSwitch || !_self.resourceSwitch){
        toCompletePolyLineSwitchStatus = 'disabled';

      }

      //check if polylines have been drawn and the resource is active
      if (_self.toCompletePolyLineSwitch && _self.resourceSwitch){

        toCompletePolyLineSwitchStatus = '';
      }

      //check if the switch is active
      if (_self.toCompletePolyLineSwitch){
        toCompleteChecked = 'checked';
      }

      let settingsModal =   ' <div class="modal fade in  bs-modal-sm" id="polyLineSettingsModal" tabindex="-1" role="basic" aria-hidden="true" style="display: block; padding-right: 17px; background: #0000005c;"> <div class="modal-dialog  modal-sm"> <div class="modal-content"> <div class="modal-header" style="background: #e87a25;"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button> <h5 class="modal-title" style="color: white;">Poly line settings</h5> </div><div class="modal-body order-summary-container"><div class="pline-popup-menu"><h4 style=""margin-top:0px;>History Line</h4><div class="flex-container flex-space-between "><div><b>Visibility</b></div> <div><label class="custom-switch"><input type="checkbox" '+historypPlineSwitchStatus+' '+ checked+' id="polyLineHistorySwitch_'+_self.resourceId+'"><span class="custom-slider"></span></label></div></div><div class="flex-container flex-space-between  " ><div><b>Line Color</b></div><div>  <input type="text" id="polyLineColorSwitch_'+_self.resourceId+'" class="form-control demo" data-control="wheel" value="'+_self.polyLineColor+'" > </div></div></div> <div class="pline-popup-menu"><h4>Incomplete Line</h4><div class="flex-container flex-space-between "><div><b>Visibility</b></div> <div><label class="custom-switch"><input type="checkbox" '+toCompletePolyLineSwitchStatus+' '+ toCompleteChecked+' id="polyLineToCompleteSwitch_'+_self.resourceId+'"><span class="custom-slider"></span></label></div></div><div class="flex-container flex-space-between" ><div><b>Line Color</b></div><div>  <input type="text" id="polyLineToCompleteColorSwitch_'+_self.resourceId+'" class="form-control demo" data-control="wheel" value="'+_self.polyLineToCompleteColor+'" > </div></div></div></div><div class="modal-footer" style="background: #d3cece;"> <div> <button class="btn btn-primary modal-dismiss" data-dismiss="polyLineSettingsModal" aria-hidden="true">Done</button> </div></div></div></div></div>';

      $('.modal').remove();
      $('body').append(settingsModal);
      //Initialize color picker in the dom
      ComponentsColorPickers.init();

    });

    this.line.addListener('click',function () {

      let tile = $('#driverTile_'+_self.resourceId);

      $('.portlet-adjustment').animate({ scrollTop: tile.offset().top }, "fast");

      tile.addClass('highlightTile');
      setTimeout(function(){
        console.log('timeout Called');
        tile.removeClass('highlightTile');
      },5000);

    });

  }

  animateHistory(){

    var _self           =   this;

    $(document).on('click','.animateHistory', (e)=> {

      this.line.setMap(null)
      if (this.popup != '') {
        this.popup.setMap(null)
      }
    })

    $(document).on('click','#animateHistory_'+this.resourceId, (e)=> {

      e.preventDefault();
      e.stopPropagation();
      clearInterval(animateZoom);

      this.line.setMap(map);
      if (this.directionPath.length > 0){

        this.animatePolyLine(100);
        this.animateZoom();


      }else{

        this.directionService( ()=> {

          this.animatePolyLine(100);
          this.animateZoom();

        })
      }
    })
  }

  animateZoom(){

    var _self       =   this;

    animateZoom     =   setInterval(function (argument) {
      var circleRadius    =   _self.circle.getRadius();
      var newRadius       =   circleRadius/(_self.zoomLevel * 2);
      if (newRadius < 50 ){
        newRadius         =   50;
      }
      map.setZoom(_self.zoomLevel);
      if (_self.zoomLevel > 17) {
        clearInterval(animateZoom);
      }else{
        _self.circle.setRadius(newRadius);
        _self.zoomLevel         +=  1;
      }
    },500);
  }

  resourceProfile(){

    if (this.address != null){

      var address = this.address[0].formatted_address;
    }else{
      var address = 'Not available'
    }

    $(document).on('click','.driver-tile', () => {

      if (this.popup != '') {
        this.popup.setMap(null)
      }
    });


    $(document).on('click','#driverTile_'+this.resourceId, () => {


      var html  = ' <div class=" map-bubble-content" id="content" ><div class="flex-container flex-space-between flex-vertical-align truckka-back"><div class="flex-container flex-vertical-align col88 padding-0"><div class="col22 " style="padding-left: 12px;"><div class="map-img-container"><img src="'+this.profilePics+'" style="width: 50px;"></div></div><div class="col88" style="padding-left: 0px;"><p class="f-paragraph bold padding-0 margin-0" style="font-size: 14px;">'+this.driverName+'</p><p class="f-paragraph bold padding-0 margin-0" style="font-size: 12px;">'+ address +'</p><p class="f-paragraph bold padding-0 margin-0" style="font-size: 10px;">'+this.plateNumber+'</p></div></div><div class="col22"><span style="color: #0e64b9;font-weight: bold"><i class="fas fa-location-arrow"></i></span></div></div><div class="flex-container"><div class="col22"><p class="align-center grey" style="font-size:13px;"><i class="fas fa-car"></i></p></div><div class="col88 padding-0"><div class="flex-container flex-wrap"><div class="col55"><div><span class="grey bold">Status</span></div><div><span class="" style="background:#10979c; padding:4px 10px;color:white;">active</span></div></div><div class="col55"><div>     <span class="grey bold">Order Id</span></div><div><span class="grey" > 3429321</span></div></div><div class="col55" style="margin-top: 10px;"><div><span class="grey bold">Order Origin</span></div><div><span class="grey" >Lagos</span></div></div><div class="col55"  style="margin-top: 10px;"><div><span class="grey bold">Order Dest</span></div><div><span class="grey" >Abuja</span></div></div></div></div>';

      var parser = new DOMParser();

      var htmlDom = parser.parseFromString(html, "text/html");
      //Make sure switch is on ie resource is active
      if (this.resourceSwitch){
        if (this.popup != '' && this._focus == true ) {
          // Note: setMap(null) calls OverlayView.onRemove()
          this.popup.setMap(null);
          this.popup  = '';
          this._focus = false;
          $('#driverTile_'+this.resourceId).css('background','white');
          this.tileBackgroundColor ='white';
        } else {

          $('#driverTile_'+this.resourceId).css('background','#eae4e4');
          this._focus = true;
          this.tileBackgroundColor ='#eae4e4';
          this.popup = new Popup(
            new google.maps.LatLng(this.latLng),
            htmlDom.firstChild
          );
          //check if the resource is active

          this.popup.setMap(map);
          this.makeActiveTab = true;
          map.setCenter(this.latLng);

        }

      }

    })

  }

  getHistory(){

    var timeTo;
    var timeFrom;

    if (this.to){
      timeTo = new Date(this.to).toISOString();
    }else{
      timeTo =  new Date(Date.now()).toISOString()
    }

    if (this.from){
      timeFrom = new Date(this.from).toISOString();

    }else{
      timeFrom =  new Date(Date.now() - 7).toISOString()
    }


    return new Promise((resolve,reject)=>{

      apiManager.pingApi('positions/?deviceId='+this.resourceId+'&to='+timeTo+'&from='+timeFrom,'GET', (data) => {

        var positions = [];

        var result    = data;

        if (data == ''){
          reject('no history to show')
        }

        for (var i = 0; i < result.length; i++) {

          var latLng  = {lat:data[i].latitude,
            lng:data[i].longitude
          };

          positions.push(latLng);

        }
        this.path     = positions;
        resolve(this.path);

      });

    })
  }

  manageInfoWindow(){

    this.infowindow = new google.maps.InfoWindow({
      content: this.plateNumber,
    });

    this.infowindow.open(map,this.marker);
  }

  onMarkerClick(){
    this.marker.addListener('click', ()=> {
      this.infowindow.open(map, this.marker);
    });

  }

  onZoomClick(){

    $(document).on('click','#zoom_'+this.resourceId, (e)=> {
      e.preventDefault()
      e.stopPropagation();

      if (!this.zoomed){
        this.zoomed = true;
        map.setCenter(this.latLng);
        this.animateZoom();
      }else{
        map.setCenter(bound.getCenter());
        map.panToBounds(bounds);
        this.zoomed = false;
      }
    })

  }

  resourceSettings(){

    var _self = this;

    $(document).on('change','#resourceSettings_'+this.resourceId,function() {

      //if switch is on
      if (_self.resourceSwitch == true && $(this).is(':checked') == false){


        if (_self.startMarker != null){
          _self.startMarker.setMap(null)
        }

        if (_self.endMarker != null){
          _self.endMarker.setMap(null)
        }

        if (_self.line.getMap() == map){
          _self.lastStatus.polyLine = true;
        }

        if (_self.popup != ''){

          if (_self.popup.getMap() == map){

            _self.lastStatus.popUp = true;
          }

          _self.popup.setMap(null);

        }

        //Turn switch off
        _self.line.setMap(null);
        _self.toCompleteLine.setMap(null);
        _self.marker.setMap(null);
        _self.deliveryPointMarker.setMap(null);
        _self.pickupMarker.setMap(null);
        _self.resourceSwitch = false;
        $(this).removeAttr('checked');
        $('#resource_container_'+_self.resourceId).addClass('disabled');

        try{
          $('#polyLineHistorySwitch_'+_self.resourceId).attr('disabled');
        }catch (e) {

        }
        //else if switch is off turn on
      }else if(_self.resourceSwitch == false && $(this).is(':checked') == true){

        _self.marker.setMap(map);

        //Check the last states of polylines and display if it was being viewed before the resource was turned off
        if (_self.lastStatus.polyLine == true){

          _self.startMarker.setMap(map);
          _self.endMarker.setMap(map);
          _self.line.setMap(map);


        }

        if (_self.lastStatus.toCompleteLine == true){

          _self.toCompleteLine.setMap(map);

        }

        if(_self.lastStatus.trackOrder == true){
          _self.pickupMarker.setMap(map);
          _self.deliveryPointMarker.setMap(map);
        }

        //Check the last states of popups and display if it was being viewed before the resource was turned off
        if (_self.popup != ''){

          if (_self.lastStatus.popUp == true){
            _self.popup.setMap(map);

          }

        }


        //Turn switch on
        _self.resourceSwitch = true;
        $(this).attr('checked',true);
        $('#resource_container_'+_self.resourceId).removeClass('disabled')

        try{
          $('#polyLineHistorySwitch_'+_self.resourceId).removeAttr('disabled');
        }catch (e) {

        }

      }


    })

  }

  polyLineSwitchSettings(){

    let _self = this;

    //Polyline switch

    $(document).on('change','#polyLineHistorySwitch_'+_self.resourceId,function () {

      //Check if the switch is turned on
      if (_self.historyPolyLineSwitch == true && $(this).is(':checked') == false) {

        //Turn off history poly line
        try{
          _self.line.setMap(null);
          _self.startMarker.setMap(null);
          _self.endMarker.setMap(null);
          _self.historyPolyLineSwitch = false;

        }catch (e) {
          openModal('Could not complete your request');
        }

      }else if (_self.historyPolyLineSwitch == false && $(this).is(':checked') == true){
        //Turn on history poly line
        try{

          _self.line.setMap(map);
          _self.startMarker.setMap(map);
          _self.endMarker.setMap(map);
          _self.historyPolyLineSwitch = true;

        }catch (e) {

          openModal('Could not complete your request');
        }

      }


    });
    $(document).on('change','#polyLineToCompleteSwitch_'+_self.resourceId,function () {

      //Check if the switch is turned on
      if (_self.toCompletePolyLineSwitch== true && $(this).is(':checked') == false) {

        //Turn off history poly line
        try{
          _self.toCompleteLine.setMap(null);
          _self.toCompletePolyLineSwitch = false;

        }catch (e) {
          openModal('Could not complete your request');
        }

      }else if (_self.toCompletePolyLineSwitch == false && $(this).is(':checked') == true){
        //Turn on history poly line
        try{

          _self.toCompleteLine.setMap(map);
          _self.toCompletePolyLineSwitch = true;

        }catch (e) {

          openModal('Could not complete your request');
        }

      }


    });

  }

  polyLineColorSwitchSettings(){

    let _self = this;

    $(document).on('change','#polyLineColorSwitch_'+this.resourceId,function () {

      _self.polyLineColor = $(this).val();

      try{
        _self.line.setOptions({strokeColor:_self.polyLineColor});
      }catch (e) {
        console.log(e);
      }

    })
    $(document).on('change','#polyLineToCompleteColorSwitch_'+this.resourceId,function () {

      _self.polyLineToCompleteColor = $(this).val();

      try{
        _self.toCompleteLine
          .setOptions({strokeColor:_self.polyLineToCompleteColor});
      }catch (e) {
        console.log(e);
      }

    })

  }

  googlePlaceId(){
    let orderPickUpPointlatLng;
    let orderDeliverPointLatLng;
    let getOrderPickupPoint;
    let googlePlaces =  new google.maps.places.PlacesService(map);

    return new Promise((resolve,reject)=>{


      if(this.orderPickUpPointLatLng != undefined && this.orderPickUpPointLatLng != undefined){
        orderPickUpPointlatLng  = this.orderPickUpPointLatLng;
        orderDeliverPointLatLng = this.orderDeliverPointLatLng;
        resolve('done');

      }else{

        getOrderPickupPoint =  new Promise((resolve,reject)=>{

          googlePlaces.getDetails({
            placeId:this.orderPickUpPoint,
          }, (result,status)=> {
            if (status == 'OK'){
              console.log('google places',result);
              this.orderPickUpPointLatLng = result.geometry.location;
              this.orderPickupPointAddress = result.formatted_address;
              orderPickUpPointlatLng = result.geometry.location;
              resolve('done');

            }else{
              reject(status);
            }
          });
        })

      }

      getOrderPickupPoint.then(()=>{

        googlePlaces.getDetails({
          placeId:this.orderDeliveryPoint,
        }, (result,status)=> {
          if (status == 'OK'){
            this.orderDeliverPointLatLng  = result.geometry.location;
            this.orderDeliverPointAddress = result.formatted_address;
            resolve(result.geometry.location);
          }else{
            reject(status);
          }
        });

      });

    });
  }

  trailOrder(){

    $(document).on('click','#trackOrder_'+this.resourceId, (e)=> {
      e.stopPropagation();

      Array.from(initObj).forEach((obj)=>{
        obj.trackResourceOrder = false;
      });
      this.trackResourceOrder = true;
      this.makeActiveTab    =  true;




      this.lastStatus.trackOrder = true;

      loaderOpen();

      let date = Date();

      this.from = this.orderStartDate;
      this.to   = date.toString();

      this.path             = [];

      this.directionPath    = [];
      this.lastPathIndex    =   0;
      this.nextPathIndex    =   1;


      this.googlePlaceId().then(()=>{


        return this.getHistory();
      }).then((path)=>{

        //get History of the path the resource has travelled from time of order creation to current time
        //convert placeId to latlng

        this.trackOrderLogic(path);


        // //set Marker Info Window Contents
        // this.pickupMarkerInfoWindowContent  = '<div><p><b> Pickup Address:</b>'+this.orderPickupPointAddress+'</p>'+this.timeToPickup+'</div>'
        // this.deliveryPointInfoWindowContent = '<div><p><b> Delivery Address:</b>'+this.orderDeliverPointAddress+'</p>'+this.timeToDeliver+'</div>';

        //set Markers
        this.startMarker.setPosition(path[0]);
        this.pickupMarker.setPosition({lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()});
        this.deliveryPointMarker.setPosition({lat: this.orderDeliverPointLatLng.lat(),lng: this.orderDeliverPointLatLng.lng()});

        this.startMarker.setMap(map);
        this.pickupMarker.setMap(map);
        this.deliveryPointMarker.setMap(map);

      }).catch((reason)=>{
        console.log(reason);
      });
    })
  }

  trackOrderLogic(path){

    let removedElements;
    let pickedUp;
    let delivered;
    let origin;
    let destination;
    let latLngBound     = new google.maps.LatLngBounds();
    let directionMatrix = new google.maps.DistanceMatrixService();

    new Promise((resolve,result)=>{

      for (var index = 0;index < path.length; index ++){
        //check if any of the path corresponds to the lat and lng of  the order pickup point

        let distance = apiManager.getDistanceFromLatLonInKm(path[index],{lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()});

        //if this is true it means the resource has picked up the order
        if(distance < 0.02){
          pickedUp = true;
          //Remove all other lat and longitude from the path[i+1] position

          removedElements   =   this.path.splice(index+1);

          this.path         =   this.path.concat([{lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()}]);

          this.directionService( (result)=> {

            // from point of order creation to the point of order pickup

            // this.line.setPath(this.directionPath);


            // this.endMarker.setMap(map);
            //set last marker at the pickup point
            // this.endMarker.setPosition({lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()});

            resolve(this.directionPath);

          });
          break;
        }
      }

      //run if the resource hasn't gotten to pickup  point
      if(!pickedUp){

        console.log('not picked up');

        this.directionPath    =   [];
        this.lastPathIndex    =   0;
        this.nextPathIndex    =   1;

        this.directionService((result)=>{

          origin      = [this.directionPath[this.directionPath.length -1],this.orderPickUpPointLatLng];
          destination = [this.orderPickUpPointLatLng,this.orderDeliverPointLatLng];

          let location    = {
            origin:origin,
            destination:destination
          };

          this.distanceMatrix(location).then((result)=>{

            //Delivery time + Pickup time

            let addUpDeliveryTime = parseInt( result.rows[0].elements[1].duration.value) + parseInt(result.rows[0].elements[0].duration.value);
            let time = apiManager.secondsToDhms(addUpDeliveryTime);

            // let time = moment().startOf('year')
            //   .seconds(addUpDeliveryTime)
            //   .format('D H mm ss');
            // // console.log('D H mm ss')
            // let formattedTime;
            // formattedTime =   time.replace(/(\d+)\s(\d+)\s(\d+)\s(\d+)/,function (match,p1,p2,p3,p4) {
            //   let days      = (p1 > 0)?p1+'day(s) ':"";
            //   let hours     = (p2 > 0)?p2+'hour(s) ':"";
            //    let minutes  = (p3 > 0)?p3+'minute(s) ':"";
            //    let seconds  = (p4 > 0)?p4+'second(s)':"";
            //    return days+hours+minutes+seconds;
            // });

            this.timeToDeliver                  = '<p>Delivery Time: About <b>'+ time +'</b> </p>';


            this.deliveryPointInfoWindowContent = '<div><p><b> Delivery Address:</b>'+this.orderDeliverPointAddress+'</p>'+this.timeToDeliver+'</div>';


            this.timeToPickup = '<p>Pickup Time: About <b>'+result.rows[0].elements[0].duration.text+'</b> </p>';

            this.pickupMarkerInfoWindowContent  = '<div><p><b> Pickup Address:</b>'+this.orderPickupPointAddress+'</p>'+this.timeToPickup+'</div>'


          });

          this.line.setPath(this.directionPath);
          this.historyPolyLineSwitch = true;
          this.lastStatus.polyLine = true;
          this.line.setMap(map);

          latLngBound = this.extendBound(latLngBound,this.directionPath);
          // console.log(this.directionPath,'direction path live');

          this.path = [{lat:this.directionPath[this.directionPath.length -1].lat(),lng:this.directionPath[this.directionPath.length -1].lng()},{lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()},{lat:this.orderDeliverPointLatLng.lat(),lng:this.orderDeliverPointLatLng.lng()}];

          this.directionPath    =   [];
          this.lastPathIndex    =   0;
          this.nextPathIndex    =   1;

          this.directionService(()=>{

            console.log(this.directionPath);

            this.toCompleteLine.setPath(this.directionPath);
            this.toCompleteLine.setMap(map);

            latLngBound = this.extendBound(latLngBound,this.directionPath);

            map.fitBounds(latLngBound);

            loaderClose();

          });
        })

      }

    })
    //Continue drawing polylines after getting to order pick up destination
      .then((toPickupPath)=>{



        this.directionPath    =   [];
        this.lastPathIndex    =   0;
        this.nextPathIndex    =   1;


        //Add pickup point to the removed element
        this.path = [{lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()}].concat(removedElements);

        for (var pathToComplete = 0; pathToComplete < this.path.length; pathToComplete++){

          let distance = apiManager.getDistanceFromLatLonInKm(this.path[pathToComplete],{lat: this.orderDeliverPointLatLng.lat(),lng: this.orderDeliverPointLatLng.lng()});
          //Check if it is delivered or close to delivering point
          if(distance < 0.01){

            delivered = true;
            //Remove all other lat and longitude from the path[i+1] position

            this.path         =   this.path.concat([{lat: this.orderDeliverPointLatLng.lat(),lng: this.orderDeliverPointLatLng.lng()}]);

            this.directionService( (result)=> {

              // from point of order creation to the point of order pickup

              this.line.setPath(toPickupPath.concat(this.directionPath));
              this.historyPolyLineSwitch = true;
              this.lastStatus.polyLine = true;
              latLngBound.extend(toPickupPath.concat(this.directionPath));

              // this.endMarker.setMap(map);
              //set last marker at the pickup point
              // this.endMarker.setPosition({lat:this.orderDeliverPointLatLng.lat(),lng:this.orderDeliverPointLatLng.lng()});
              map.fitBounds(latLngBound);

              loaderClose();

            });
            break;
          }

        }

        if(!delivered){

          this.directionService( (result)=> {
            origin      = [this.directionPath[this.directionPath.length -1]];
            destination = [this.orderDeliverPointLatLng];

            let location    = {
              origin:origin,
              destination:destination
            };

            this.distanceMatrix(location).then((result)=>{

              this.timeToDeliver = '<p>Delivery Time: About <b>'+result.rows[0].elements[0].duration.text+'</b> </p> <p><b>'+result.rows[0].elements[0].distance.text+'</b> away</p>'
              this.deliveryPointInfoWindowContent = '<div><p><b> Delivery Address:</b>'+this.orderDeliverPointAddress+'</p>'+this.timeToDeliver+'</div>';

            });
            // from point of order creation to the point of order pickup

            this.line.setPath(toPickupPath.concat(this.directionPath));
            this.lastStatus.polyLine = true;
            this.historyPolyLineSwitch = true;

            this.path = [{lat:this.directionPath[this.directionPath.length -1].lat(),lng:this.directionPath[this.directionPath.length -1].lng()},{lat:this.orderDeliverPointLatLng.lat(),lng:this.orderDeliverPointLatLng.lng()}];

            this.directionPath    =   [];
            this.lastPathIndex    =   0;
            this.nextPathIndex    =   1;

            this.directionService(()=>{
              this.toCompleteLine.setPath(this.directionPath);
              this.toCompleteLine.setMap(map);

              latLngBound = this.extendBound(latLngBound,this.directionPath);


              this.lastStatus.toCompleteLine  =   true;
              this.toCompletePolyLineSwitch   =   true;
              loaderClose();
              map.fitBounds(latLngBound);
            })
          });

        }
      });
  }

  liveTrackingLogic(path){

    let distance = apiManager.getDistanceFromLatLonInKm({lat:path.lat(),lng:path.lng()},{lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()});


    if (distance < 0.01){


      //order has been picked up
      this.pickupMarkerInfoWindowContent  = '<div><p><b> Pickup Address:</b>'+this.orderPickupPointAddress+'</p></div>'


      //update pop up window contents for delivery and pick up


    }else{
      //order has not been picked up

      //update to be completed polyline
      let directionServicePath = [{lat:path.lat(),lng:path.lng()},{lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()},{lat:this.orderDeliverPointLatLng.lat(),lng:this.orderDeliverPointLatLng.lng()}];
      new Promise((resolve,reject)=>{
        this.mimicDirectionService(directionServicePath,0,1,[], (result) =>{

          this.toCompleteLine.setPath(result);
          this.toCompletePolyLineSwitch   =   true;

          resolve('done')
        });
      })
        .then(()=>{

          //update pop up window content for delivery and pick up
          let origin      = [path,this.orderPickUpPointLatLng];
          let destination = [this.orderPickUpPointLatLng,this.orderDeliverPointLatLng];

          let location    = {
            origin:origin,
            destination:destination
          };
          this.distanceMatrix(location).then((result)=>{

            let addUpDeliveryTime = parseInt( result.rows[0].elements[1].duration.value) + parseInt(result.rows[0].elements[0].duration.value);
            let time = apiManager.secondsToDhms(addUpDeliveryTime);

            // console.log(time,'time');

            let formattedTime;

            // formattedTime =   time.replace(/(\d+)\s(\d+)\s(\d+)\s(\d+)/,function (match,p1,p2,p3,p4) {
            //   let days      = (p1 > 0)?p1+'day(s) ':"";
            //   let hours     = (p2 > 0)?p2+'hour(s) ':"";
            //   let minutes  = (p3 > 0)?p3+'minute(s) ':"";
            //   let seconds  = (p4 > 0)?p4+'second(s)':"";
            //   return days+hours+minutes+seconds;
            // });

            this.timeToDeliver                  = '<p>Delivery Time: About <b>'+ time +'</b> </p>';


            this.deliveryPointInfoWindowContent = '<div><p><b> Delivery Address:</b>'+this.orderDeliverPointAddress+'</p>'+this.timeToDeliver+'</div>';


            this.timeToPickup = '<p>Pickup Time: About <b>'+result.rows[0].elements[0].duration.text+'</b> </p>';

            this.pickupMarkerInfoWindowContent  = '<div><p><b> Pickup Address:</b>'+this.orderPickupPointAddress+'</p>'+this.timeToPickup+'</div>'


          });
        })
        .catch(function (reason) {
          console.log(reason);
        })

    }

  }

  extendBound(bound,latlngs){
    for(var index = 0; index < latlngs.length;index++){

      try{
        bound.extend(latlngs[index]);
      }catch (e) {
        break;
      }
    }
    return bound
  }

  distanceMatrix(location){
    let directionMatrix = new google.maps.DistanceMatrixService();

    let distanceMatrixRequest = {
      origins:location.origin,
      destinations:location.destination,
      travelMode:'DRIVING'
    };
    return new Promise((resolve,reject)=>{
      directionMatrix.getDistanceMatrix(distanceMatrixRequest,function (response,responseStatus) {

        if (responseStatus == 'OK'){
          resolve(response);
        }

      });
    }).catch(function (reason) {
      openModal('An error occured could not complet your request');
    })

  }

}