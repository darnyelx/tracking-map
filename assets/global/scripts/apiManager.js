class ApiManager{

  constructor(){
    this.serverUrl  = 'server.traccar.org';
    this.username   = 'olaitan.adesanya@gmail.com';
    this.password   = '4HLZcaKD';
  }



  logIn() {

    var formdata        = new FormData();

    formdata.append('email','olaitan.adesanya@gmail.com');
    formdata.append('password','4HLZcaKD');


    $.ajax({

      url: 'http://'+this.serverUrl+'/api',
      data:{email:'olaitan.adesanya@gmail.com',password:'4HLZcaKD'},
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      method:'POST',
      success: function(data) {
        return data;
      },

      error:function(error){
        openModal('An error occured please try again or check your internet connection');
      }
    });

  }

  pingApi(path,method,callback) {

    $.ajax({

      url: 'http://'+this.serverUrl+'/api/'+path,
      crossDomain: true,
      headers:{
        'Accept': 'application/json',
        "Authorization": "Basic " + btoa(this.username + ":" + this.password)
      },
      type:method,
      success: function(data) {

        return data;
      },

      error:function(error){
        openModal('An error occured please try again or check your internet connection');
      }
    }).then(function (data) {
      callback(data);
    })
  }


  pingServerApi(path,method){
    return new Promise((resolve,reject)=>{
        $.ajax({

          url:path,
          crossDomain: true,
          type:method,
          success: function(data) {

            return data;
          },

          error:function(error){
            reject(error);
            openModal('An error occured please try again or check your internet connection');
          }
        }).then(function (data) {
          resolve(data);       
      })
    })
  }

  /**
   Lat long center calculator gotten from stackoverflow
   @ https://stackoverflow.com/questions/6671183/calculate-the-center-point-of-multiple-latitude-longitude-coordinate-pairs
   */
  rad2degr(rad) {
    return rad * 180 / Math.PI;
  }

  degr2rad(degr){
    return degr * Math.PI / 180;
  }
  degToCompass(num){

    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];

  }

  /**
   * @param latLngInDeg array of arrays with latitude and longtitude
   *   pairs in degrees. e.g. [[latitude1, longtitude1], [latitude2
   *   [longtitude2] ...]
   *
   * @return array with the center latitude longtitude pairs in
   *   degrees.
   */

  getDistanceFromLatLonInKm(latLng1,latLng2) {
    var lat1  = latLng1.lat;
    var lat2  = latLng2.lat;
    var lon1  = latLng1.lng;
    var lon2  = latLng2.lng
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }


}
let apiManager = new ApiManager();
