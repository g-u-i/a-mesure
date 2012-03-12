jQuery(document).ready(function($){
	
var $map_canvas = $('#map_amesure'),

	_emplacements = [ // destinsations possibles du menu
		[85.02326810689277	, -178.80784606933594,	13],	// 0 — Tu l’as vue ma tête
		[85.00520147387853	, -179.52444648742676,	12],	// 1 — Premières prises de vue
		[84.99085546165952	, -179.72702836990356,	13],	// 2 — De la représentation en psychiatrie
		[84.99120768065286	, -179.4438943862915,	13],	// 3 — Je est un autre
		[84.98942384940813	, -178.94757843017578,	13],	// 4 — Lettre Philippe Chabert
		[84.99135006004269	, -178.80593633651733,	13],	// 5 — Soi-même mis à plat
		[84.9732054567037	, -179.47723960876465,	12],	// 6 — Deuxièmes prise de vue
		[84.95983111574265	, -179.2097053527832,	14],	// 7 — Entretien
		[84.94214774772453	, -179.2119584083557,	13],	// 8 — Présentation des auteurs
		[84.94024808300588	,-178.80514240264893, 	13],	// 9 — Crédits

	],
	
	_liensExternes = [ // liens à placer sur la map
		['Commander', 85.02316944756805, -179.18893432617188,"http://filigranes.com/main.php?act=livres&s=fiche&id=417"],
		['Filigrame', 	84.93784220785864, -178.82603681087494,"http://filigranes.com"],
		['g-u-i',		84.94085552330552, -178.8309291601181, "http://g-u-i.net"],
		['gouraud',		84.93822464978408, -179.224076628685,	"http://s.gouraud.free.fr"],
		['culture visuelle',84.9403105334931, -179.12816083431244, "http://culturevisuelle.org/viesociale/"],
		['martin winckler',84.93939640871109, -179.054780960083, "http://martinwinckler.com"]
	],
	_latlngDepart = new google.maps.LatLng(85.02060175777159, -179.30798149108887),
	_zoomDepart = 8,
	_mapMinZoom = 16,
	_mapMaxZoom = 10,
	_zoomLevel = 8,
	_serveurTuiles = "http://tiles.dcfvg.fr/amesure/",
	_firstTime = true, // le menu reste actif au changement de zoom
	_tellMouse = false,
	_icons_folder = '_lib/icons/',
	_markers =[],
	image_liens = 'externLink.gif',
	
	
	_amesure_map = new google.maps.Map(document.getElementById("map_amesure"),{
			backgroundColor: "#666666",
			center: _latlngDepart,
			panControl: false,
			zoomControl: true,
			scaleControl: false,
			mapTypeControl: true,
			OverviewMapControlOptions: true,
			streetViewControl: false,
			mapTypeControl: false,
			zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_CENTER},
          	zoom: _zoomDepart}
	),

	_TypeTuiles = new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			var normalizedCoord = getNormalizedCoord(coord, zoom);
			if (!normalizedCoord) {return null;}
			var bound = Math.pow(2, zoom);
			return _serveurTuiles+"tiles/" + zoom + "/" + normalizedCoord.x + "_" + normalizedCoord.y + ".jpg";
		},
		tileSize: new google.maps.Size(256, 256),
		isPng: false,
		maxZoom: _mapMinZoom,
		minZoom: _mapMaxZoom,
		name: "amesure"
	});
	////////	////////////////////////////////////////////////////////////////////////////////
	
	_amesure_map.mapTypes.set('amesure', _TypeTuiles);
	_amesure_map.setMapTypeId('amesure');
	mvMap(85.02060175777159, -179.30798149108887,12);
	setMarkers();
	setupMenu();
	

	

	/* EVENTS 	*/////////////////////////////////////////////////////////////////////////////////
	
	google.maps.event.addListener(_amesure_map, 'dragstart', function() { 
		menuOff();
	});
	google.maps.event.addListener(_amesure_map, 'click', function() { 
		menuOff();
	}); 
	google.maps.event.addListener(_amesure_map, 'zoom_changed', function() {
    	if(!_firstTime){menuOff();}else{_firstTime=false;}
    	_zoomLevel = _amesure_map.getZoom();
    	
    	console.log("zoom:"+_zoomLevel);
    	delMarkers();
    	if(_zoomLevel > 12){setMarkers();}
    	if(_zoomLevel < 12){delMarkers();}
  	});
  	
  	google.maps.event.addListener(_amesure_map, 'click', function(event) {
		if(_tellMouse){alert(event.latLng)};
	});
	$(document).bind('keydown', function(event) {
		//console.log('keydown', event);
		if (event.keyCode == 67) { 
			var $center = lat_lng_center();
			console.log($center.lat+','+$center.lng);
		}
		if (event.keyCode == 77) { 
			_tellMouse = true;
		}
	});
	
	
	/* Utilitaires 	*////////////////////////////////////////////////////////////////////////////////
	
	function updMarkers(){
		
	}
	
	function delMarkers() {
  		$.each(_markers, function(index, marker) {
  			//console.log("del:"+index);
  			marker.setMap(null);
  		})
	}
	
	function setMarkers(){
			image_liens = _icons_folder+'laplusbellefleche-'+_zoomLevel+'.png';
			
			$.each(_liensExternes, function(index, value) {   		 
  				var myLatLng = new google.maps.LatLng(value[1], value[2]);
  				marker = new google.maps.Marker({
      				position: myLatLng,
      				map: _amesure_map,
      				icon: image_liens
  				});
  			_markers[index] = marker;
  			delete _markers;
		});
		$.each(_markers, function(index, marker) {
			google.maps.event.addListener(marker, 'click', function(){
				window.open(_liensExternes[index][3], '_blank');
			});
		});
	}
	function setupMenu(){
		$.each(_emplacements, function(key, value) { 
  			$('#men'+key).click(function() {_firstTime = true;mvMap(value[0], value[1], value[2]);});
		});
	}
	function getNormalizedCoord(coord, zoom)
	{
	    var y = coord.y,x = coord.x,tileRange = 1 << zoom;
	
	    if (y < 0 || y >= tileRange){return null;}
	    if (x < 0 || x >= tileRange){x = (x % tileRange + tileRange) % tileRange;}
	    return {x: x,y: y};
	}
	function mvMap(Clat, Clng, zoom) {
		var dist = DistanceFromCenter(lat_lng_center(), Clat, Clng),
			time = (dist*dist)*200;
		window.setTimeout(function() {_amesure_map.panTo(new google.maps.LatLng(Clat, Clng));}, time);
		window.setTimeout(function() {_amesure_map.setZoom(zoom);}, time);
	    console.log(time);

	}
	

	
	function lat_lng_center(){
		var C = _amesure_map.getCenter(),
			lat = C.lat(),
			lng = C.lng();
			
			return {lat:lat,lng:lng,}
	}
	function DistanceFromCenter($center, lat, lng) {
		    //console.log("lat:"+$center.lat+"->"+lat);
	        //console.log("lng:"+$center.lng+"->"+lng);
	        return Math.floor(Math.abs(($center.lat - lat), 2) + Math.pow(($center.lng - lng), 2));
    }
    function menuOff() { $('#menu').removeClass().addClass('off');}
	function menuOn() {$('#menu').removeClass().addClass('on');}
	$('#zone').mouseover(function() {menuOn();});
});


