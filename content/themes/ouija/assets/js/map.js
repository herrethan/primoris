"use strict";

(function(){

  var mapStyles = [
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "hue": "#ffbb00"
        },
        {
          "saturation": 43.400000000000006
        },
        {
          "lightness": 37.599999999999994
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "hue": "#99ff00"
        },
        {
          "saturation": "0"
        },
        {
          "lightness": "0"
        },
        {
          "gamma": "1.00"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "hue": "#FFC200"
        },
        {
          "saturation": -61.8
        },
        {
          "lightness": 45.599999999999994
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "all",
      "stylers": [
        {
          "hue": "#FF0300"
        },
        {
          "saturation": -100
        },
        {
          "lightness": 51.19999999999999
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "all",
      "stylers": [
        {
          "hue": "#FF0300"
        },
        {
          "saturation": -100
        },
        {
          "lightness": 52
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "hue": "#008fff"
        },
        {
          "saturation": "0"
        },
        {
          "lightness": "20"
        },
        {
          "gamma": "1.00"
        }
      ]
    }
  ];

  var locale = {
    lat: 40.992585,
    lng: -74.036598
  };

  var mapOptions = {
    zoom: 14,
    center: locale,
    draggable: true,
    options: {
      scrollwheel: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      styles: mapStyles
    }
  };

  var mapEl = document.getElementById('map');
  var gmap = new google.maps.Map(mapEl, mapOptions);

  var marker = new google.maps.Marker({
    position: locale,
    map: gmap
  });

})();
