
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
    this.orderId           =   obj.orderId;
    this.isActiveResource  =   false;
    this.geoCoder          =   new google.maps.Geocoder;
    this.directionsService =   new google.maps.DirectionsService;
    this.currentPercent    =    0;
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
    this.indexedMovement          =   1;
    this.count                    =   1;
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
    this.isolateResource();
    this.locked;
    this.lockedArray = [];
    this.releasedIndex;
    this.initSummary();

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

    console.log('position called',this.plateNumber);

    // console.log(typeof this.latLng.lat);

    // if (typeof this.latLng.lat == 'number'){
    //
    //   var oldLatLng       = new google.maps.LatLng (this.latLng) ;
    //
    // }else{}

    var oldLatLng       = new google.maps.LatLng (this.latLng) ;

    this.latLng           = {lat:position.lat(),lng:position.lng()},{lat:position.lat(),lng:position.lng()}
    var _self             = this;
    this.newLivePosition  = position;
    this.lastLivePosition = oldLatLng;

    this.geoCodePosition(this.latLng, (data)=> {
      this.address     = data;
      this.speed       = '';
      var moved        = [];

      moved.push(oldLatLng);
      moved.push(this.latLng);

      _self.path.concat(this.latLng);

      // if ( _self.directionPath.length > 1){
      //    _self.directionPath.concat(this.latLng);
      // }

      if(this.trackResourceOrder){
        console.log('being tracked')
        this.liveTrackingLogic(this.latLng);
      }

      this.liveDirectionService(function (data) {
        if (data != false){

          _self.animateMovementPolyLine(data,400);
          _self.updateSummary();

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

  initAutomation(){

    this.googlePlaceId().then( (data)=> {
      this.directionsService.route({

        origin      : this.orderPickUpPointLatLng,
        destination : data,
        travelMode: 'DRIVING'

      }, (response, status)=> {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === 'OK') {
          this.automatedPath  = response.routes[0].overview_path;
          this.position = this.automatedPath[0];

        } else {
          alert('error');
        }
      });
    });

  }

  automatePositionUpdate(){
    let self = this;
    let automateInterval =  setTimeout(function () {

      if (self.indexedMovement < self.automatedPath.length){
        self.currentLatLng = self.automatedPath[self.indexedMovement];
        self.position = self.automatedPath[self.indexedMovement];
        self.indexedMovement += 1;

      }

    },100)
  }

  online(){

    $('#status_signal_'+this.resourceId).removeClass('status-btn-offline').addClass('status-btn-online');

  }

  offline(){

    $('#status_signal_'+this.resourceId).removeClass('status-btn-online').addClass('status-btn-offline');

  }

  geoCodePosition(postion,callback){

    if (postion != null) {

      this.geoCoder.geocode({
        location: postion
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
    if (isolatedResource !== null ){
      this.line.setMap(null);
    }else{
      this.line.setMap(map);

    }


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
  initTrackingLabel(pLocation,dLocation,time){
    let html = '<ul class="label-container flex-container flex-center"><li style="border-right:none;"><div class="pick-up-location-header-pro"> <div class="pick-up-content"><div class="pick-up-content-head"><span>Order ID: '+this.orderId+'</span></div><div class="pick-up-content-body"><span>Plate NO: '+this.plateNumber+'</span></div></div></div></li><li style="border-right:none;"><div class="pick-up-location-header"> <div class="pick-up-content"><div class="pick-up-content-head"><span>Pick Up Location</span></div><div class="pick-up-content-body"><span>'+pLocation+'</span></div></div></div></li><li style="border-right:none;"><div class="pick-up-location-header"> <div class="pick-up-content"><div class="pick-up-content-head"><span>Delivery Location</span></div><div class="pick-up-content-body"><span>'+dLocation+'</span></div></div></div></li><li style="border-right:none;"><div class="pick-up-timer-header"><span id="time-indicator_'+this.resourceId+'">'+time+'</span></div></li></ul>';

    $('.label-container').remove();
    $('#gn-menu').append(html);

  }

  // initPickupMarker(time,location){
  //   let html = '<div class="tooltip"> <div class="tooltip--container"> <div class="tooltip--text"> <div id="time-tooltip"> <span>'+time+' <br/>MIN </span> </div><div id="pickup-tootip"> <h1>PICKUP LOCATION</h1> <span>'+location+'/span> </div></div><div class="tooltip--tip animated"></div></div></div>';
  //   this.pickupMarker = new CustomInfo(this.orderPickUpPointLatLng.lat(),html);
  // }

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

    let tileHtml = '<li><div id="contain-order"><div id="order-body" style="background : '+this.tileBackgroundColor+'"><div id="order-left"><img src="'+this.profilePics+'" width="60"/></div><div id=""> <label class="switch"> <input type="checkbox" '+switchButton+' id="resourceSettings_'+this.resourceId+'"> <span class="slider"></span> </label> <div id ="resource_container_'+this.resourceId+'" ><p><b>'+this.driverName+'</b></p><p class="f-paragraph bold padding-0 margin-0" style="font-size: 10px;">'+this.plateNumber+'</p><p class="f-paragraph bold padding-0 margin-0" style="font-size: 12px;">'+address+'</p><p> <button id="zoom_'+this.resourceId+'"  class="btn-zoom">   <img src= "'+baseUrl+'/TruckkaMap/image/zoom.png"  width="20"/></button> <button class="btn-zoom" id="poly-line_'+this.resourceId+'"><img src="'+baseUrl+'/TruckkaMap/image/Maps-Polyline-icon.png" width="20"/></button><button class="btn-zoom isolate-button" id="isolate_'+this.resourceId+'"><img src="https://static.thenounproject.com/png/104443-200.png" width="20"/></button> </p><p  ><button  value="" class="btn-orders" id="trackOrder_'+this.resourceId+'"   >+ Track order</button> <button type="submit" value="" class="btn-orders-view" id="driverTile_'+this.resourceId+'">+ View orders</button></p><p></p></div></div></div></div></li>';
    $('.gn-scroller').append(tileHtml);
  }

  getJourneyDistance(){

    return new Promise( (resolve,reject)=> {

      this.googlePlaceId().then( ()=> {
        let origin        = [this.orderPickUpPointLatLng];
        let destination   = [this.orderDeliverPointLatLng];

        let location    = {
          origin:origin,
          destination:destination
        };

        return this.distanceMatrix(location)
      }).then( (result) =>{
        this.journeyDistance  = result.rows[0].elements[0].distance.value;
        console.log(this.journeyDistance,'journey distance')
        resolve(this.journeyDistance);
      })
    })
  }

  getDistanceTravelled(){
    return new Promise((resolve,reject)=>{
      this.googlePlaceId().then( ()=> {
        let origin;
        if (this.currentLatLng !== undefined){

           origin   = [this.currentLatLng];
        }else{
           origin   = [new google.maps.LatLng(this.latLng)]
        }
        let destination   = [this.orderDeliverPointLatLng];

        console.log(origin,destination,'origin ')
        let location    = {
          origin:origin,
          destination:destination
        };
        return this.distanceMatrix(location)
      }).then((result)=>{
        this.distanceTravelled = this.journeyDistance -  result.rows[0].elements[0].distance.value;
        console.log(this.distanceTravelled,'travelled distance')
        resolve(this.distanceTravelled)
      })
    })

  }

  initSummary(){

    this.getJourneyDistance()
        .then((result)=>{
          return this.getDistanceTravelled();
        })
        .then( ()=> {

          let lastPercent =  this.currentPercent;
          this.currentPercent = (this.distanceTravelled)/this.journeyDistance;

          let html = '<a href="#" class="row"><div class="second circle"  id="summary_' + this.resourceId + '"><strong></strong></div><h3 style="color:#000;">' + this.plateNumber + '</h3> </a>';

          $('.menu-panel2').append(html);
          $('#summary_' + this.resourceId).circleProgress({
            startAngle: -1.55,
            value: this.currentPercent,
            animationStartValue: lastPercent,
            fill: {
              color: '#ffa500'
            }
          }).on('circle-animation-progress', function(event, progress,stepValue) {
              $(this).find('strong').html(Math.round(100 * stepValue) + '<i>%</i>');
          })
        })
  }

  updateSummary(){
    this.getDistanceTravelled().then( ()=> {
      let lastPercent =  this.currentPercent;
      this.currentPercent = (this.distanceTravelled)/this.journeyDistance;
      $( '#summary_'+this.resourceId).circleProgress({
        value: this.currentPercent,
        animationStartValue: lastPercent,
      })

    })
  }

  createMarker() {



    var html  = '<img src="https://png.pngtree.com/svg/20170825/top_view_of_the_green_car_478991.png" style="width:60px;"/> ';

    var parser = new DOMParser();

    var htmlDom = parser.parseFromString(html, "text/html");
    //Make sure switch is on ie resource is active
        // Note: setMap(null) calls OverlayView.onRemove()



        this.marker = new CustomMarker(
          htmlDom.firstChild,
          new google.maps.LatLng(this.latLng)
        );
        if (isolatedResource !== null ){

          this.marker.setMap(null);

        }else{
          this.marker.setMap(map);

        }

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
        var distance         =   apiManager.getDistanceFromLatLonInKm(_self.path[lastIndex],_self.path[nextIndex])
        console.log(_self.path,'disssss')
        _self.nextPathIndex   =   nextIndex + 1;

        if ((distance > maxSteps && distance > 0.5) || this.path.length - 1 == nextIndex ){
          console.log(lastIndex,nextIndex,'last path =',this.path.length - 1);
          _self.lastPathIndex   =   nextIndex;
          this.directionsService.route({

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



        console.log(path,'check path ')


        //get distance of maximum number of steps that can be taken
        let maxSteps         = apiManager.getDistanceFromLatLonInKm(path[0],path[path.length - 1])/5;
        //get distance between the last index and the current index
        let distance         = apiManager.getDistanceFromLatLonInKm(path[lastPathIndex],path[nextPathIndex]);
        //make sure the distance is not greater than the max steps and 0.5 or it equal to the last index in the array
        if ((distance > maxSteps && distance > 0.1) || path.length - 1 == nextPathIndex  ){

          //store the last used index

          inLastPathIndex = nextPathIndex;
          console.log(path[lastPathIndex],path[nextPathIndex],'kkkk')
          this.directionsService.route({

            origin      : new google.maps.LatLng(path[lastPathIndex]),
            destination : new google.maps.LatLng(path[nextPathIndex]),
            travelMode  : 'DRIVING'

          }, (response, status)=> {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            if (status === 'OK') {

              directionPath = directionPath.concat(response.routes[0].overview_path);

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
    var distance         = apiManager.getDistanceFromLatLonInKm({lat:this.lastLivePosition.lat(),lng:this.lastLivePosition.lng()},{lat:this.newLivePosition.lat(),lng:this.newLivePosition.lng()});
    console.log(distance);

    if (distance > 0){

      this.directionsService.route({

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

  liveInterPolated(path){

      var numSteps = 30;

      let interPolatedPath = [];

      for (var i = 0; i < path.length -1 ; i++) {

        for (var steps = 0; steps <= numSteps; steps++) {

          var interpolated  =   google.maps.geometry.spherical.interpolate(path[i],path[i+1],steps/numSteps);

          interPolatedPath.push(interpolated);
        }
      }

      return interPolatedPath;

    }

  animateMovementPolyLine(moved,speed){

    var limit          = moved.length - 1;
    var _self          = this;
    var lastPosition   = this.marker.position;
    var customBounds   = new google.maps.LatLngBounds();
    let markerPath     = this.liveInterPolated(moved);
    var limit          = markerPath.length - 1;

    let i              =  0;

    (function(i){

      // clearInterval(interval);

    let  interval =  setInterval(()=> {

      i += 1;

        if (i > limit) {
          clearInterval(interval);
          _self.automatePositionUpdate();

        }else{

          var path = _self.line.getPath();

          // Because path is an MVCArray, we can simply append a new coordinate
          // and it will automatically appear.
          var heading = google.maps.geometry.spherical.computeHeading(markerPath[i-1],markerPath[i]);

          path.push(markerPath[i]);
          bounds.extend(markerPath[i]);
          // map.fitBounds(bounds);
          // map.setCenter(bounds.getCenter());
          // _self.marker.setMap(null);
          // _self.infowindow.setMap(null);

          _self.marker.latlng = markerPath[i];
          _self.infowindow.position = markerPath[i];
          _self.marker.draw();
          _self.infowindow.draw();
          if (!map.getBounds().contains(_self.marker.getPosition())){
            console.log('not in bound')
            map.fitBounds(bounds);
          }
          // _self.marker.setMap(map);
          // _self.infowindow.setMap(map);
          // bounds.extend(markerPath[i]);
          // map.panToBounds(customBounds);

          // bounds.extend(markerPath[i]);

          //
          // if (_self.isActiveResource){
          //   console.log('center changed')
          //   map.setCenter(markerPath[i]);
          // }
          // _self.icon.rotation = heading;
          // _self.marker.setIcon(_self.icon);
          lastPosition = _self.marker.position;

        }

      }, speed)

    })(i);

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

      console.log(_self.historyPolyLineSwitch,'history poly line switch')
      console.log(_self.resourceSwitch,'resource switch');

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

      console.log(historypPlineSwitchStatus,'switch status');

      let settingsModal =   '<div class="overlay-content" id="modal"> <div class="overlay-content-head"> <div class="poly-head"> <h1>POLYLINE SETTINGS</h1> </div><div class="poly-close"> <button class="close-btn close modal-dismiss" data-dismiss="modal" aria-hidden="true"> X </button> </div></div><div class="overlay-content-body"> <div class="title-overlay-main"> <span class="title-overlay"><b>History<b></span> </div><div class="over-all-body"> <div class="overlay-content-body-1"> <h3>switch</h3> </div><div class="overlay-content-body-2"> <label class="switch"> <input type="checkbox" '+historypPlineSwitchStatus+' '+ checked+' id="polyLineHistorySwitch_'+_self.resourceId+'"> <span class="slider"></span> </label> </div><div class="overlay-content-body-1"> <h3>Color Picker</h3> </div><div class="overlay-content-body-2"> <input type="color" id="polyLineColorSwitch_'+_self.resourceId+'" class="color-picker" value="'+_self.polyLineColor+'" name="excolor1"> </div></div><div class="title-overlay-main"> <span class="title-overlay"><b>Orders<b></span> </div><div class="over-all-body"> <div class="overlay-content-body-1"> <h3>switch</h3> </div><div class="overlay-content-body-2"> <label class="switch"> <input type="checkbox" '+toCompletePolyLineSwitchStatus+' '+ toCompleteChecked+' id="polyLineToCompleteSwitch_'+_self.resourceId+'"> <span class="slider"></span> </label> </div><div class="overlay-content-body-1"> <h3>Color Picker</h3> </div><div class="overlay-content-body-2"> <input type="color" id="polyLineToCompleteColorSwitch_'+_self.resourceId+'" class="form-control demo" data-control="wheel" value="'+_self.polyLineToCompleteColor+'" class="color-picker" name="excolor1"> </div></div></div></div>';

      $('.overlay-conten').remove();
      $('body').append(settingsModal);
      //Initialize color picker in the dom

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
      if(this.historyPolyLineSwitch){
        this.line.setMap(map);
      }
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

      let html   = '<div class="card" id="card_'+this.resourceId+'"> <button class="close-btn-nill-small-info-window close-btn-nr" data-target="card_'+this.resourceId+'"> x </button> <div class="card-image"> <img src="'+this.profilePics+'" alt="John" style="width:40%"> </div><div class="card-div-1"> <div> <span class="span-bold"> <i class="fa fa-user"></i> Name:</span> <span>'+this.driverName+'</span> </div><div> <span class="span-bold"> <i class="fa fa-user"></i> Plate Number:</span> <span>'+this.plateNumber+'</span> </div><div> <span class="span-bold"><i class="fa fa-map-marker"></i> Location:</span><span>'+address+'</span> </div><div> <span class="span-bold"><i class="fa fa-book"></i> Order ID:</span><a href="#">'+this.orderId+'</a> </div></div><div class="card-div"> <span class="span-bold" ><i class="fa fa-map-marker"></i> Orgin:</span>'+this.orderPickupPointAddress+' <br/> <span class="span-bold"><i class="fa fa-map-marker"></i> Destination:</span>'+this.orderDeliverPointAddress+' </div></div>'

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
          $('.card').remove();
          $('body').append(html)
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

       this.path = this.automatedPath;
        resolve(this.path);

    })
  }

  manageInfoWindow(){

    let html = '<div class="tooltip--container-small"> <div class="tooltip--text-small"> <div id="pickup-tootip-small"> <h1>'+this.plateNumber+'</h1> </div><div class="tooltip--tip animated"></div></div></div>';



    this.infowindow = new CustomInfo(
      new google.maps.LatLng(this.latLng),
      html
    );
    if (isolatedResource !== null ){
      this.infowindow.setMap(null);
    }else{
      this.infowindow.setMap(map);
    }


  }

  onMarkerClick(){
    // this.marker.addListener('click', ()=> {
    //   this.infowindow.open(map, this.marker);
    // });

  }

  onZoomClick(){

    $(document).on('click','#zoom_'+this.resourceId, (e)=> {
      e.preventDefault()
      e.stopPropagation();

      console.log(initObj,'init obj');
      console.log(Array.from(initObj),'array from')
      Array.from(initObj).forEach((obj)=>{
        console.log('stop animation')
        obj.marker.setAnimation(null);
      });
      console.log('sooo');

      if (!this.zoomed){
        this.zoomed = true;
        map.setCenter(this.latLng);
        this.animateZoom();
        // this.marker.setAnimation(google.maps.Animation.BOUNCE)

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
        _self.infowindow.setMap(null);
        _self.toCompleteLine.setMap(null);
        _self.marker.setMap(null);
        _self.deliveryPointMarker.setMap(null);
        _self.pickupMarker.setMap(null);
        _self.resourceSwitch = false;
        $(this).removeAttr('checked');
        $('#resource_container_'+_self.resourceId).addClass('custom-disabled');

        try{
          $('#polyLineHistorySwitch_'+_self.resourceId).attr('custom-disabled');
        }catch (e) {

        }
        //else if switch is off turn on
      }else if(_self.resourceSwitch == false && $(this).is(':checked') == true){

        _self.marker.setMap(map);
        _self.infowindow.setMap(map);



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
        $('#resource_container_'+_self.resourceId).removeClass('custom-disabled')

        try{
          $('#polyLineHistorySwitch_'+_self.resourceId).removeAttr('custom-disabled');
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
      //check if the resource has already been tracked..the placeId has been GeoCoded
      if(this.orderPickUpPointLatLng != undefined && this.orderDeliverPointLatLng != undefined){
        orderPickUpPointlatLng  = this.orderPickUpPointLatLng;
        orderDeliverPointLatLng = this.orderDeliverPointLatLng;
        resolve('done');

      }else{

        getOrderPickupPoint =  new Promise((resolve,reject)=>{

        this.geoCoder.geocode({
            location:this.latLng
          }, (result,status)=> {
            if (status == 'OK'){
              console.log('google places',result);
              this.orderPickUpPointLatLng = new google.maps.LatLng(this.latLng)
              this.orderPickupPointAddress = result[0].formatted_address;
              orderPickUpPointlatLng = new google.maps.LatLng(this.latLng)
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
            console.log(result.geometry.location,'geoPlaces')
            this.orderDeliverPointLatLng  = result.geometry.location;
            this.orderDeliverPointAddress = result.formatted_address;
            resolve(result.geometry.location);
          }else{
            reject(status);
          }
        });

      }).catch((reason)=>{
        console.log(reason);
      });

    });
  }
  
  // initCustomPickupMarker(time,location,latLng){
  //    var html  = ' <div class="tooltip"> <div class="tooltip--container"> <div class="tooltip--text"> <div id="close_btn_tootips"><button  class="close-btn-nill"> X </button> </div>  <div id="time-tooltip"><span>'+time+'<br />MIN </span></div> <div id="pickup-tootip"><h1>PICKUP LOCATION</h1><span>'+location+'</span><span>'+this.plateNumber+'</span></div> </div><div class="tooltip--tip animated"></div></div></div>';
  //
  //     this.cusPickUpPoint = new CustomInfo(
  //           latLng,
  //           html
  //         );
  //
  //     this.cusPickUpPoint.setMap(map);
  // }

  // initCustomDeliveryMarker(time,location,latLng){
  //   var html  = ' <div class="tooltip"> <div class="tooltip--container"> <div class="tooltip--text"> <div id="close_btn_tootips"><button  class="close-btn-nill"> X </button> </div>  <div id="time-tooltip"><span>'+time+'</span></div> <div id="pickup-tootip"><h1>DELIVERY LOCATION</h1><span>'+location+'</span><span>'+this.plateNumber+'</span></div> </div><div class="tooltip--tip animated"></div></div></div>';
  //
  //   this.cusDeliveryPoint = new CustomInfo(
  //     latLng,
  //     html
  //   );
  //
  //   this.cusDeliveryPoint.setMap(map);
  // }

  updateDeliveryTimeIndicator(time){
    $('#time-indicator_'+this.resourceId).html(time)
  }

  trailOrder(){
    $(document).on('click','#trackOrder_'+this.resourceId, (e)=> {
      e.stopPropagation();
      e.preventDefault();
      for(var obj in initObj){
        console.log('sdfs called');
        initObj[obj].trackResourceOrder = false;
        initObj[obj].toCompleteLine.setMap(null);
        initObj[obj].deliveryPointMarker.setMap(null)
      }


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
        // this.startMarker.setPosition(path[0]);
        this.pickupMarker.setPosition(this.orderPickupPointLatLng);
        this.deliveryPointMarker.setPosition(this.orderDeliverPointLatLng);

        // this.startMarker.setMap(map);
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

    if (this.currentLatLng !== undefined){

        this.path = [{lat:this.currentLatLng.lat(),lng:this.currentLatLng.lng()},{lat:this.orderDeliverPointLatLng.lat(),lng:this.orderDeliverPointLatLng.lng()}];
    }else{
        this.path = path;
    }

    this.directionPath    =   [];
    this.lastPathIndex    =   0;
    this.nextPathIndex    =   1;

    this.directionService(()=>{

      origin      = [this.directionPath[this.directionPath.length -1]];
      destination = [this.orderDeliverPointLatLng];

      if (this.currentLatLng !== undefined){

        origin        = [this.currentLatLng];
        destination   = [this.orderDeliverPointLatLng]

      }else{

        origin        = [this.directionPath[0]];
        destination   = [this.orderDeliverPointLatLng]

      }

      let location    = {
        origin:origin,
        destination:destination
      };

      this.distanceMatrix(location).then((result)=>{

        let duration = result.rows[0].elements[0].duration.text;

        // let time = apiManager.secondsToDhms(duration);
        this.initTrackingLabel(this.orderPickupPointAddress,this.orderDeliverPointAddress,duration);

        // this.initCustomPickupMarker(0,this.orderPickupPointAddress,this.orderPickUpPointLatLng)
        //
        // this.initCustomDeliveryMarker(duration,this.orderDeliverPointAddress,this.orderDeliverPointLatLng)

      });

      this.toCompleteLine.setPath(this.directionPath);
      this.toCompleteLine.setMap(map);

      latLngBound = this.extendBound(bounds,this.directionPath);

      map.fitBounds(latLngBound);

      loaderClose();

    });
  }

  liveTrackingLogic(path){
    let origin;
    let destination;
    let latLngBound
    let distance = apiManager.getDistanceFromLatLonInKm(path,{lat:this.orderPickUpPointLatLng.lat(),lng:this.orderPickUpPointLatLng.lng()});

    let directionServicePath = [path,{lat:this.orderDeliverPointLatLng.lat(),lng:this.orderDeliverPointLatLng.lng()}];
    new Promise((resolve,reject)=>{

      this.mimicDirectionService(directionServicePath,0,1,[], (result) =>{
        this.toCompleteLine.setPath(result);
        this.toCompleteLine.setMap(map);
        this.toCompletePolyLineSwitch   =   true;

        if (this.currentLatLng !== undefined){

          origin        = [this.currentLatLng];
          destination   = [this.orderDeliverPointLatLng]

        }else{

          origin        = [this.directionPath[0]];
          destination   = [this.orderDeliverPointLatLng]

        }

        let location    = {
          origin:origin,
          destination:destination
        };

        this.distanceMatrix(location).then((result)=>{

          let duration = result.rows[0].elements[0].duration.text;

          // let time = apiManager.secondsToDhms(duration);

          console.log('update delivery indicator')
          this.updateDeliveryTimeIndicator(duration)

        });
      });
    })

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
  isolateResource(){
    let self = this;
    $(document).on('click','#isolate_'+this.resourceId, function() {
      $('.isolate-button').removeClass('isolate-active');
      if (isolatedResource !== self.resourceId){
        isolatedResource    = self.resourceId;
        for(var resource in initObj){
          if (initObj[resource].resourceId !== self.resourceId) {
            initObj[resource].hideResource();
          }else{
            $(this).addClass('isolate-active');
            self.showResource();
          }
        }

      }else{

        isolatedResource = null;
        for(var resource in initObj){
           initObj[resource].showResource();
        }

      }
    })
  }
  hideTile(){
    $('#driverTile_'+this.resourceId).hide('fast');
  }

  showTile(){
    $('#driverTile_'+this.resourceId).show('fast');

  }

  hideResource(){
    this.marker.setMap(null)
    this.line.setMap(null)
    this.infowindow.setMap(null)
  }

  showResource(){
    this.marker.setMap(map)
    this.line.setMap(map)
    this.infowindow.setMap(map)
  }

}