class ResourcesManager{

  constructor() {

    this.Resources  = '';
    this.removePolyMarker();
  }

  firstInit() {



        this.creatResources(resources);

  }

  removePolyMarker(){
    $(document).on('click','.view-history',()=>{

      for(var property in initObj){
        initObj[property].directionServiceMarker.forEach((markers)=>{
          markers.setMap(null);

        })
      }
    })
  }

  creatResources(resources){
    loaderOpen();

    if (resources != null) {
      resources.forEach( (resource) => {

        //Initialize new Resource Object
        setTimeout( ()=> {
          loaderClose();
          loaderOpen();

          setTimeout( ()=> {
            initObj[resource.id]                = new Resources({
              resourceId        :   resource.id,
              status            :   resource.status,
              latLng            :   resource.lastPosition,
              plateNumber       :   resource.plateNumber,
              driverName        :   resource.driverName,
              to                :   resource.to,
              from              :   resource.from,
              profilePics       :   resource.profilePics,
              orderPickUpPoint  :   resource.orderPickUpPoint,
              orderStartDate    :   resource.orderStartDate,
              orderDeliveryPoint:   resource.orderDeliveryPoint,
              orderId           :   resource.orderId,
            });
            if (initObj[resource.id].latLng != null){

              // initObj[resource.id].marker.setPosition(initObj[resource.id].latLng);
              bounds.extend(initObj[resource.id].latLng);
              map.setCenter(bounds.getCenter());
              map.fitBounds(bounds);

              initObj[resource.id].geoCodePosition(initObj[resource.id].latLng, (data)=> {

                initObj[resource.id].address     = data;
                initObj[resource.id].resourceProfile();
                console.log(initObj[resource.id].status,initObj[resource.id].driverName);
                // if (initObj[resource.id].status != 'online'){
                //
                //     initObj[resource.id].status = 'offline';
                //     initObj[resource.id].offline();
                //
                // }else{
                //     initObj[resource.id].online();
                //
                // }
                initObj[resource.id].createTile();
                initObj[resource.id].initAutomation()

              });
            }else{
              console.log(resource.id+': no latLng');
            }
            initObj[resource.id].manageInfoWindow();
            loaderClose()
          },5000)
        },resource.delay)






        // Fetch Resouce Status

        //set object property


      })

    }
    else{
      console.log('nothing to show');
    }

    // console.log(bounds.getCenter().toJSON());


  }

  resourceFilter(data,devicesPosition){

    var sortedArray  =  data.filter(function (element) {



      for (var i = 0; i < resources.length; i++) {


        if (resources[i]['imei'] == element.uniqueId ){

          element.plateNumber         = resources[i]['plateNumber'];
          element.driverName          = resources[i]['driverName'];
          element.to                  = resources[i]['to'];
          element.from                = resources[i]['from'];
          element.profilePics         = resources[i]['profilePics'];
          element.orderPickUpPoint    = resources[i]['orderPickUpPoint'];
          element.orderDestination    = resources[i]['orderDestination'];
          element.orderStartDate      = resources[i]['orderStartDate'];
          element.orderDeliveryPoint  = resources[i]['orderDeliveryPoint'];


          // console.log(resources[i]['orderPickUpPoint'],resources[i]['driverName'])

          return true;
        }

      }

    });


    var sortedDevicesPosition = devicesPosition.forEach((element)=> {

      for (var i = 0; i < sortedArray.length; i++) {

        if (sortedArray[i].id == element.deviceId){
          var lastPosition               =    {lat:element.latitude,lng:element.longitude};
          sortedArray[i].lastPosition    =    lastPosition;
        }

      }

    });

    return sortedArray;
  }

  statusUpdate(data){
    // console.log(data.id);
    if(initObj[data.id] != null){
      console.log('update');
      initObj[data.id].update = data.status;
    }
  }

  positionUpdate(data){

    if(initObj[data.deviceId] != null){

      initObj[data.deviceId].position = data;
    }

  }

  manageAnimationButton(){

    $(document).on('click','.animateHistory',function (e) {
      var html = '<button class="btn btn-danger stop-animation">stop animation</button>';
      $('.stop-animation').remove();
      $('#btnHolder').append(html);
    })

    $(document).on('click','.stop-animation',function (e) {
      e.preventDefault();
      clearInterval(interval);
      clearInterval(animateZoom);
      map.setZoom(zoom)
      map.setCenter(bounds.getCenter());
      $(this).remove();
    })

  }





}
