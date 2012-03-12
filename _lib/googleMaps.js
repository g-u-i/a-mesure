function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;
    var tileRange = 1 << zoom;
     if (y < 0 || y >= tileRange) {
      return null;
    }
    if (x < 0 || x >= tileRange) {
      x = (x % tileRange + tileRange) % tileRange;
    }
     return {
      x: x,
      y: y
    };
  }
  var dcfvgTypeOptions = {
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord) {
          return null;
        }
        var bound = Math.pow(2, zoom);
        return "content/img/" + zoom + "_" + normalizedCoord.x + "_" + normalizedCoord.y+ ".gif";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: false,
    maxZoom: 5,
    minZoom: 2,
    name: "dcfvg"
    };

    var dcfvgMapType = new google.maps.ImageMapType(dcfvgTypeOptions);

    function initialize() {
    var myLatlng = new google.maps.LatLng(72, -126);
    var myOptions = {
        center: myLatlng,
        zoom:3,
        backgroundColor:"#E9E9E9",
        panControl: false,
        zoomControl: true,
        scaleControl: false,
        mapTypeControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
         }
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
    map.mapTypes.set('dcfvg', dcfvgMapType);
    map.setMapTypeId('dcfvg');


    }
