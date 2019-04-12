/** Initializes the map and the custom popup. */
var initObj     = {};
var na          =  'N/A'
var overlayView;
var animateZoom;
var directionsService;
var popUp;
var popup;
var bounds;
var zoom        =   7;
var interval    =   0;
var map;
let isolatedResource = null;
var resources   = [

  {
    'imei'          : '658341',
    'plateNumber'   : 'XL544KJA',
    'driverName'    : 'Osita Chiemeke',
    'to'            :   '13 November 2018 ',
    'from'          :   '1 october 2018',
    'profilePics'   :    'https://m.media-amazon.com/images/M/MV5BMjQyMDM1NTQ3NF5BMl5BanBnXkFtZTgwNTY3NTUxNzE@._V1_UX140_CR0,0,140,209_AL_.jpg',
    'orderStartDate'    : 'TUE Feb 05 2019 15:00:37 GMT+0100 (West Africa Standard Time)',
    'orderDeliveryPoint'  : 'ChIJi1egaImNOxARf8AJIdLsmmM',
    'orderPickUpPoint'    : 'ChIJcR20DImNOxARc65ykEnGxh4',
    'lastPosition'  :   {lat:7.094510,lng:4.831850},
    'orderId'       : '4422121',
    id:5,
    delay:100000


  },
  {
    'imei'          : '658341',
    'plateNumber'   : 'XL549KJA',
    'driverName'    : 'Benson Ihiama',
    'to'            :   '13 November 2018 ',
    'from'          :   '1 october 2018',
    'profilePics'   :    'https://pbs.twimg.com/media/DcYakqPXkAEGEK4.jpg',
    'orderStartDate'    : 'TUE Feb 05 2019 15:00:37 GMT+0100 (West Africa Standard Time)',
    'orderDeliveryPoint'  : 'ChIJi1egaImNOxARf8AJIdLsmmM',
    'orderPickUpPoint'    : 'ChIJcR20DImNOxARc65ykEnGxh4',
    'lastPosition'  :   {lat:7.394510,lng:4.931850},
    'orderId'       :   '3239201',
    id:6,
    delay:30000


  },
  {
    'imei'          : '864895030159287',
    'plateNumber'   : 'XD360RBC',
    'driverName'    : 'Damilola Johnoson',
    'to'            :   '13 November 2018 ',
    'from'          :   '1 october 2018',
    'profilePics'   :  'https://i.pinimg.com/236x/1e/88/e1/1e88e19dc29f54a1dd77230b9399685c.jpg',
    'orderDeliveryPoint'  : 'ChIJi1egaImNOxARf8AJIdLsmmM',
    'lastPosition'  :   {lat:7.094510,lng:8.718480},
    'orderId'       :   '3239202',
    id:3,
    delay:300000


  },
  {
    'imei'          : '952726',
    'plateNumber'   : 'XG258KTU',
    'driverName'    : 'Awe Wemma',
    'to'            : '13 November 2018 ',
    'from'             : '1 october 2018',
    'profilePics'       :    'https://i.pinimg.com/originals/b3/32/56/b332565e3f3868b648b8a91a6c24fc80.jpg',
    'orderStartDate'    : '20 January 2019 ',
    'orderDeliveryPoint'  : 'ChIJcR20DImNOxARc65ykEnGxh4',
    'orderPickUpPoint'    : 'ChIJi1egaImNOxARf8AJIdLsmmM',
    'lastPosition'  :   {lat:7.302860,lng:4.831850},
    'orderId'       :   '3239221',
    id:4,
    delay:400000



  },
  {
    'imei'          : '658341',
    'plateNumber'   : 'XL549KJA',
    'driverName'    : 'Osita Chiemeke',
    'to'            :   '13 November 2018 ',
    'from'          :   '1 october 2018',
    'profilePics'   :    'https://pbs.twimg.com/media/DcYakqPXkAEGEK4.jpg',
    'orderStartDate'    : 'TUE Feb 05 2019 15:00:37 GMT+0100 (West Africa Standard Time)',
    'orderDeliveryPoint'  : 'ChIJi1egaImNOxARf8AJIdLsmmM',
    'orderPickUpPoint'    : 'ChIJcR20DImNOxARc65ykEnGxh4',
    'lastPosition'  :   {lat:7.094510,lng:4.831850},
    'orderId'       :   '3231201',
    id:89,
    delay:500000



  },
  {
    'imei'          : '864895030159642',
    'plateNumber'   : 'XYZ123AB',
    'driverName'    : 'Paul Johnoson',
    'to'            :   '13 November 2018 ',
    'from'          :   '1 october 2018',
    'profilePics'     :  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScabZvjX3w_XKzAkUeRiS_GVPVT43eeunVwe3yHDekKSPMwX8r',
    'orderDeliveryPoint'  : 'ChIJcR20DImNOxARc65ykEnGxh4',
    'lastPosition'  :   {lat:6.563714,lng:3.345117},
    'orderId'       :   '3239261',
    id:68,
    delay:600000



  },
  {
    'imei'          : '864895030159709',
    'plateNumber'   : 'XD352RBC',
    'driverName'    : 'Paul Johnoson',
    'to'            :   '13 November 2018 ',
    'from'          :   '1 october 2018',
    'profilePics'   :    'https://i.pinimg.com/originals/b3/32/56/b332565e3f3868b648b8a91a6c24fc80.jpg',
    'orderDeliveryPoint'  : 'ChIJcR20DImNOxARc65ykEnGxh4',
    'lastPosition'  :   {lat:7.544510,lng:4.556030},
    'orderId'       :   '3231201',

    id:70,
    delay:700000



  },
  {
    'imei'          : '864895030160491',
    'plateNumber'   : 'XK228LSR',
    'driverName'    : 'Chiemeke Ifeanyi',
    'to'            :   '13 November 2018 ',
    'from'          :   '1 october 2018',
    'profilePics'   :    'http://www.youthvillage.co.za/wp-content/uploads/2016/03/Nkuli-M.jpg',
    'orderDeliveryPoint'  : 'ChIJcR20DImNOxARc65ykEnGxh4',
    'lastPosition'  :   {lat:7.094510,lng:4.831850},
    'orderId'       :   '3279201',
    id:87,
    delay:800000

  }
];

var map;


function definePopupClass() {

  /** Defines the Popup class. */
  CustomMarker = function(content,latlng) {
    this.latlng = latlng;
    this.args = {};
    this.setMap(map);
    this.content = content;
  }

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.onAdd = function() {
    var self = this;
    var div = this.div;
    if (!div) {
      // Generate marker html
      div = this.div = document.createElement('div');
      div.className = 'custom-marker';
      div.style.position = 'absolute';
      var innerDiv = document.createElement('div');
      innerDiv.className = 'custom-marker-inner';
      div.appendChild(innerDiv);

      if (typeof(self.args.marker_id) !== 'undefined') {
        div.dataset.marker_id = self.args.marker_id;
      }

      google.maps.event.addDomListener(div, "click", function(event) {
        google.maps.event.trigger(self, "click");
      });

      var panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }

  };
  CustomMarker.prototype.onRemove = function(){
    this.div.remove();
    this.div = null;
  }
  CustomMarker.prototype.draw = function() {
    if (this.div) {

      let position = this.latlng;


      var pos = this.getProjection().fromLatLngToDivPixel(position);
      this.div.style.left = pos.x + 'px';
      this.div.style.top = pos.y + 'px';
    }
  };

  CustomMarker.prototype.getPosition = function() {
    return this.latlng;
  };
  CustomMarker.prototype.stopEventPropagation = function() {
    var anchor = this.div;
    anchor.style.cursor = 'auto';

    ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart',
      'pointerdown,hover']
      .forEach(function(event) {
        anchor.addEventListener(event, function(e) {
          e.stopPropagation();
        });
      });
  };

  /**
   * A customized popup on the map.
   * @param {!google.maps.LatLng} position
   * @param {!Element} content
   * @constructor
   * @extends {google.maps.OverlayView}
   */


  CustomInfo = function(latlng,content) {
    this.position = latlng;
    this.args = {};
    this.setMap(map);
    this.content = content;
  }

  CustomInfo.prototype = new google.maps.OverlayView();

  CustomInfo.prototype.onAdd = function() {
    var self = this;
    var div = this.div;
    if (!div) {
      // Generate marker html
      div = this.div = document.createElement('div');
      div.className = 'tooltip';

      $(div).append(this.content);


      if (typeof(self.args.marker_id) !== 'undefined') {
        div.dataset.marker_id = self.args.marker_id;
      }

      google.maps.event.addDomListener(div, "click", function(event) {
        google.maps.event.trigger(self, "click");
      });

      var panes = self.getPanes();
      panes.floatPane.appendChild(div);
    }
  };
  CustomInfo.prototype.onRemove = function(){
    this.div.remove();
    this.div = null;
  }
  CustomInfo.prototype.draw = function() {
    if (this.div) {

      let position = this.position;


      var pos = this.getProjection().fromLatLngToDivPixel(position);
      this.div.style.left = pos.x + 'px';
      this.div.style.top = pos.y + 'px';
    }
  };

  CustomInfo.prototype.update      =  function(html,position){
    this.content  =   html;
    this.position =   position;
    // Generate marker html
    $(this.div).html(this.content);
    this.draw();

  }

  CustomInfo.prototype.getPosition = function() {
    return this.position;
  };
  CustomInfo.prototype.stopEventPropagation = function() {
    var anchor = this.div;
    anchor.style.cursor = 'auto';

    ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart',
      'pointerdown']
      .forEach(function(event) {
        anchor.addEventListener(event, function(e) {
          e.stopPropagation();
        });
      });
  };

  Popup = function(position, content) {
    this.position = position;

    content.classList.add('popup-bubble-content');

    var pixelOffset = document.createElement('div');
    pixelOffset.classList.add('popup-bubble-anchor');
    pixelOffset.appendChild(content);

    this.anchor = document.createElement('div');
    this.anchor.classList.add('popup-tip-anchor');
    this.anchor.appendChild(pixelOffset);

    // Optionally stop clicks, etc., from bubbling up to the map.
    this.stopEventPropagation();
  };
  // NOTE: google.maps.OverlayView is only defined once the Maps API has
  // loaded. That is why Popup is defined inside initMap().
  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  /** Called when the popup is added to the map. */
  Popup.prototype.onAdd = function() {
    this.getPanes().floatPane.appendChild(this.anchor);
  };

  /** Called when the popup is removed from the map. */
  Popup.prototype.onRemove = function() {
    if (this.anchor.parentElement) {
      this.anchor.parentElement.removeChild(this.anchor);
    }
  };

  /** Called when the popup needs to draw itself. */
  Popup.prototype.draw = function() {
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
    // Hide the popup when it is far out of view.
    var display =
      Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';

    if (display === 'block') {
      this.anchor.style.left = divPosition.x + 'px';
      this.anchor.style.top = divPosition.y + 'px';
    }
    if (this.anchor.style.display !== display) {
      this.anchor.style.display = display;
    }
  };

  /** Stops clicks/drags from bubbling up to the map. */
  Popup.prototype.stopEventPropagation = function() {
    var anchor = this.anchor;
    anchor.style.cursor = 'auto';

    ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart',
      'pointerdown']
      .forEach(function(event) {
        anchor.addEventListener(event, function(e) {
          e.stopPropagation();
        });
      });
  };
}






function writeTo(){
  // Deal with Auto fill on page load;
      var eventCreator    =   $('.form-copy');
      var data ="";
      eventCreator.val("");
  $(document).on('change',".form-copy",function(e){
      eventCreator = $(this);
      var data = ""
      if (eventCreator[0].nodeName == 'INPUT') {
              data        =   eventCreator.val();
      }else if (eventCreator[0].nodeName == 'SELECT'){
          if (eventCreator[0].selectedOptions[0].value !="") {
               data        =   eventCreator[0].selectedOptions[0].innerText;
          }else{
              data         = "";
          }
      }else{
              data         =   eventCreator.html();
      }
              bindTo       =   eventCreator.attr('bind-to');

      if (data != "") {
        if ($("."+bindTo).length != 0) {
          console.log('class')
          $("."+bindTo).html(data);
        }else if ($("#"+bindTo).length != 0) {
           $("#"+bindTo).html(data);
           console.log('id')
        }else{
          console.log('error');
        }
      }else{
        console.log('empty')
      }
    })
  }
function getDestinationAjax() {
   var originSelect   =   $('#standardOrigin');
   //Reset form field for cache
   originSelect.val("");

   originSelect.on('change', function() {
      var val         = $(this).val();
      //remove all child element of standardDestination

      $('#standardDestination').html("");
      $("#standardDestination").attr('disabled','disabled');

      var _token      = $("input[name='_token']").val();
      var formdata    = new FormData();

      formdata.append('originalServer',val);
      formdata.append('_token',_token);

      $.ajax({
          dataType:"JSON",
          //url: "http://truckka.com.ng:8083/checkOrigins",
          url: baseUrl+"/checkOrigins",
          method:'POST',
          data: formdata,
          processData: false,
          contentType: false,
          success: function(data) {
              if($.isEmptyObject(data.error)){
                  var length = data.success;
                  var trueLength = length.length;
                  if(trueLength > 0){
                      var catOptions = "";
                      for(var i = -1; i < trueLength; i++) {
                          if (i == -1) {
                            catOptions = '<option></option>'
                          }else{
                            var company   = data.success[i].destination;
                              var region    = data.success[i].region;
                            catOptions    = "<option  value="+ data.success[i].id +">" + company + "</option>";
                          }
                          $("#standardDestination").append(catOptions);
                      }
                      $("#standardDestination").removeAttr('disabled');
                  }else{
                    openModal('There are no destinations for this origin. contact Admin for  help ');
                  }
              }else if(trueLength == 0){
                  openModal("We can't get destinations for this origin please contact Admin for help");
              }
          },
        error:function(error){
             openModal('An error occured please try again or check your internet connection');
        }
      });
  })
}




function loaderOpen () {

    var html = '<div class="flex-container flex-vertical-align flex-center loaders" style="width: 100%; height: 100%; position: fixed;z-index: 44444;background: #07070766;"><div class="loader-img"><img src="'+baseUrl+'/assets/pages/img/load.gif" alt="logo" class="logo-default" /> </a></div></div>';
      //remove any instance of Loader in DOM
  //append new Loader
  $('body').prepend(html);
}

function loaderClose () {
  $('.loaders').remove();
}

function openModal(modalContent) {

  var html = '<div class="modal fade bs-modal-sm alert-modal" id="cancel" tabindex="-1" role="dialog" aria-hidden="true" style="display:inherit;background:rgba(25, 24, 24, 0.48);opacity:1;"><div class="modal-dialog modal-sm" style="margin-top:100px;"><div class="modal-content"><div class="modal-header" style="background: #e87a25;"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><h4 class="modal-title" style="color: white;">Attention <span><i class="fas fa-exclamation-circle"></i></span></h4></div><div class="modal-body">'+modalContent+' </div><div class="modal-footer"><button type="button" class="btn dark btn-info dismiss-modal" data-dismiss="modal">close</button></div></div><!-- /.modal-content --></div><!-- /.modal-dialog --></div>';

  $(document).on('click',".dismiss-modal",(e)=>{
    e.preventDefault();
    $('.modal').fadeOut();
    $('.modal-backdrop').fadeOut();
  });
  //remove any instance of modal in DOM
  $('.alert-modal').remove();
  //append new modal
  $('body').append(html);
}
function closeModal(){
  $('.modal').remove();
}

function validatorForm() {
  $(document).on('submit','.ajax-form-submit', function(e){
    var getForm  = $(this).attr('form-target');
    var validate = true;
    var formElements = $(this)[0];
    Array.from(formElements).forEach(function(element){
        // console.log($(element).hasClass('validate'));
      if ($(element).hasClass('validate')) {
        if (element.value == '') {
          validate = false;
        }
      }else{
      }
    })
    if (!validate) {
      e.preventDefault();
      e.stopPropagation();
      openModal('You have not selected some fields');
      return false;
    }else{
    }
  })
}

function artificialFormSubmit() {
  $(document).on('click','.artificial-submit',function (e) {
    var FormTarget  =  $(this).attr('form-target');
    $("."+FormTarget).submit();
  })
}

function permissionSelector() {
 $(document).on('click','.permission_info',function(event) {
  event.stopPropagation();
  var info =  $(this).attr('data-info');
  openModal(info);
 });
 $(document).on('change',".permissionInput", function (event){
  var element         = $(this);
  var element_id      = element.attr('id');
  var label           = $('[data-label="'+element_id+'"]');
  console.log(element);
  if (element[0].checked){
      label.addClass('permission-selected');
    }else{
      label.removeClass('permission-selected');
    }
 })
}

function formSubmitOrder() {

    $(document).on('submit','.ajax-form-submit',function(e){

        var getForm = $(this).attr('form-target')
        $('#myModal').modal('hide');
        e.preventDefault();
        var form        = $(this)[0];
        var url         = form.action
        var _token = $("input[name='_token']").val();
        //Initiate Loader

        loaderOpen();

        $.ajax({

            processData: false,
            contentType: false,
            url: url,
            type:'POST',
            data: new FormData(form),

            success: function(data) {

                loaderClose();

                if($.isEmptyObject(data.error)){

                    openModal('Your request was successful');
                    $(document).on('click','.dismiss-modal',function (e) {

                      e.preventDefault();
                      var redirectTo  = $(form).attr('redirect-to');
                     if(redirectTo != null){
                      window.location.assign(redirectTo);
                     }
                    })
                    form.reset();

                    /*setTimeout(function(){
                       location.reload();
                   }, 1000);*/

                }else{
                    var html = " ";
                    var newError = data.error;

                    var counter = 0
                    for(errorIndex = 0; errorIndex < newError.length; errorIndex++){
                      html += '<p><b>-  '+newError[errorIndex]+' </b></p>';
                    }
                    openModal(html);

                }

            },
         error:function(e){

            loaderClose();

            openModal('Sorry, your request was not successful. Try again or contact admin for help');
         }

        });


    });


}

function  modalController() {
  $(document).on('click','.modal-dismiss',function (event) {

    event.stopPropagation();
    event.preventDefault();

    let target = $(this).attr('data-dismiss');
    $('#'+target).remove();
  })
}

function duplicator(){
  $('.duplicator').click(function(e){
    e.preventDefault();
    var getDom    = $(this).attr('duplicate-dom');
    var appendTo  = $(this).attr('append-to');
    var dom       = $('#'+getDom)[0].outerHTML;
    $('.'+appendTo).append(dom);

  })
}

function selectToSubmit() {
 $(document).on('click','.submitSelect', function () {
    var action      = $(this).attr('form-action');
    var formTarget  = $(this).attr('form-target');
    var form        = $('#'+formTarget)[0];
    form.action     = action;
 })
}

function notify(){
  $('.notify').click(function (e) {
   var notifyData           = $(this).attr('notify-text');
   openModal(notifyData);
  })
}

function mtSelectHtml(id,value) {
   var html ='<div class="btn btn-danger" style="margin-right:5px;" id="'+id+'">'+value+'</div>';
   return html;
}

function moduleLogic () {
  var modules             =   $('.modules');
  var selectedModules     =   new Array();

  Array.from(modules).forEach((element)=>{
    if (element.checked) {
      selectedModules.push($(element).val());
    }
  })

  $(document).on('change','.advanceSwitch',function (argument) {

    if (this.checked) {
      openModal('Only use this feature if you can correctly configure it');
      $('.module-switch').removeAttr('disabled');
    }else{
      $('.module-switch').attr('disabled','disabled');
    }
  })

  $(document).on('change','.roles',function (e) {

    //Get Role Permission

    var formdata           =    new FormData();
    var _token             = $("input[name='_token']").val();

    formdata.append('roleId',$(this).val());
    formdata.append('_token',_token);

    var permissions        =    $.ajax({

            processData: false,
            contentType: false,
            url: baseUrl+'/getpermissions',
            type:'POST',
            data: formdata,
            success: function(data) {

                if($.isEmptyObject(data.error)){
                    return data;

                }else{
                    var html = " ";
                    var newError = data.error;

                    var counter = 0
                    for(errorIndex = 0; errorIndex < newError.length; errorIndex++){
                      html += '<p><b>-  '+newError[errorIndex]+' </b></p>';
                    }
                    openModal(html);
                    return false;
                }
            },
         error:function(e){
            openModal('Sorry, your request was not successful. Try again or contact admin for help');
            return false
         }

        });

      permissions.then(()=>{
        var result         = permissions.responseJSON;

        if (result.permissionModules.length < 1) {
           openModal('This Role does not have any permission rule set');
        }

        var tableBody     =   $('.tableBody');

        tableBody.html("");

        Array.from(result.companyModules).forEach((item)=>{
          var check        = '';

            if (result.permissionModules.includes(item.id)) {
                 check     = "checked='checked'";
            }

          var html         =   '<tr><td>'+item.moduleName+'</td><td>'+item.moduleDescription+'</td><td><label class="switch switcha"><input name="modules[]" type="checkbox" '+check +' value="'+item.id+'"><span class="slider slidera round" style="margin:0px;"></span></label></td></tr>';

          tableBody.append(html);

      })
    })
  })
}
function mt_select(){
  try{
    var resource_limit  = $("#resource-form").attr('data-check-limit').toString();
    var checkbox_count  = $("#resource-form").attr('data-check-attached').toString();

  }catch (e) {

  }

  /// checked for preselected checkboxes
  var checkboxes = $(".mt-select-resource");

  var autoAppend =  new Promise((resolve,reject)=>{

    Array.from(checkboxes).forEach((item)=>{

      var value           =     item.value;
      var number          =     $(item).attr('number')
      var appendTo        =     $(item).attr('appendTo');
      var id              =     value.replace(/\s/g, "");

      if (item.checked){

        if (checkbox_count < resource_limit){

          $("."+appendTo).append(mtSelectHtml(id,number));

        }else{

          item.checked = false;
            reject('limit reached');

          }
      }else{

        $("#"+id).remove();
      }
    })
   })

  autoAppend.catch((reject)=>{
    alert(reject);
   })

  checkboxes.change(function(){
    var changedElement     = $(this)[0];
    var value              = changedElement.value;
    var number             = $(changedElement).attr('number');
    var appendTo           = $(changedElement).attr('appendTo');
    var id                 = value.replace(/\s/g, "");
    console.log(resource_limit+'resource limit');
    if (changedElement.checked) {
      if (checkbox_count < resource_limit){
        checkbox_count++;
        $("."+appendTo).append(mtSelectHtml(id,number));
      }else{
        changedElement.checked = false;
        alert('limit reached');
      }
    }else{
      checkbox_count--;
      $("#"+id).remove();
    }
  })
}

function nodeRemover() {
  console.log('something clicked')

  $(document).on('click','.close-btn-nr',function (event) {
    event.preventDefault();
    console.log('something clicked')
    let nodeTarget =  $(this).attr('data-target');
    $('#'+nodeTarget).remove();
  })
}

function initMap() {

  directionsService = new google.maps.DirectionsService;
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

function sideBarToggle(argument) {

  $(document).on('click','.toggle-sidemenu', function (e) {

    var elementTarget  =  $(this).attr('data-target');

    var element        =  $('.'+elementTarget);

    if (element.hasClass('window-open')) {
      element.removeClass('window-open');
      element.addClass('window-close');
    }else{
      element.addClass('window-open');
      element.removeClass('window-close');
    }

  })
}

function switchManager(){
   $(document).on('click','.custom-switch',function (event) {
     event.stopPropagation();
   })
}



$(document).ready(function() {

    nodeRemover();
    modalController();
    permissionSelector();
    sideBarToggle();
    switchManager();
    artificialFormSubmit();
    getDestinationAjax();     
    writeTo();
    validatorForm();
    formSubmitOrder();
    duplicator();
    selectToSubmit();
    // getResourceOrders();

    mt_select();

    moduleLogic();
    // mt_select();
    notify();



});
