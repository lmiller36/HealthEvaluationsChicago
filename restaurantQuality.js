var map=null
var currentLocMarker,pos,result;
var markers=[];
var windows=[];
var initialized=false;
var allRests=null;
var JSON=[];

function init() {
	clearOverlays();
	if(map==null){
		initMap();
	}
	var restaurant=document.getElementById("input").elements[0].value;
	var zipcode=document.getElementById("input").elements[1].value
	
	if(!initialized){
		getJSON(getText());
		initialized=true;
	}

	addRest(restaurant,zipcode);


	//var onlyZipcode=splitByZipcode("60611")
	// else{

		// getCurrentLoc(function(pos){
		// recenterMap(pos);
		// });


	//}
	
}

function addRest(restaurant,zipcode){
	console.log(zipcode=="");
for(var x=0;x<JSON.length;x++){
	var temp=JSON[x];
	if(temp['name'].indexOf(restaurant.toLowerCase())!=-1&&(zipcode==""||zipcode==temp['zipcode'])){
		var coords=temp['coords'];
		var pos=createPositionArr(coords.substring(1,coords.indexOf(",")),coords.substring(coords.indexOf(",")+2,coords.length-1));
			var marker = new google.maps.Marker({
			map: map,
			title: temp['name'],
			position: pos,
		});

		var contentString='<b>'+temp['name']+'</b><br><br><left>results: '+temp['risk']+'<br>address: '+
  		temp['address']+'<br>zipcode:'+temp['zipcode']+
  		'<br>results:'+temp['results']+'<br>comments:'+format(temp['comments'])+'<br><br></left>';
  		marker.content = contentString;


  		var infowindow = new google.maps.InfoWindow();
  		google.maps.event.addListener(marker, 'click', function(){
  			infowindow.setContent(this.content);
  			infowindow.open(map, this);
  		});


		markers.push(marker);
	}
}
}

function format(comments){
	var arr=comments.split("|");
	var string="<br><p align=\"left\">";
	for(var x=0;x<arr.length;x++){
		string+=(x+1)+": "+arr[x].substring(arr[x].indexOf(".")+1).toLowerCase()+"<br><br>";
	}
	string+="</p>"
	return string;
}

function getJSON(text){
	for(var x=0;x<text.length;x++){
		var temp=text[x].split("^");
		var arr=[];
		arr['name']=temp[0].toLowerCase();
		arr['risk']=temp[1];
		arr['address']=temp[2];
		arr['zipcode']=temp[3];
		arr['results']=temp[5];
		arr['coords']=temp[6];
			arr['comments']=temp[4];
		JSON.push(arr);
	}
}


function splitByZipcode(zipcode){
	var arr=[];
	var a=allRests['data'];
	console.log(x.length);
	console.log(x);
	for(var i=0;i<100;i++){
		var x=allRests['data'][i][17];
		console.log(x);
	}

}



function geocodeAddress(geocoder,address,resultsMap,callback) {
		//var address = document.getElementById('address').value;
		geocoder.geocode({'address': address}, function(results, status) {
			if (status === 'OK') {
				var lat=parseFloat(results[0].geometry.location.lat());
				var lng=parseFloat(results[0].geometry.location.lng());

				callback(createPositionArr(lat,lng));

			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	}

	function recenterMap(pos){
		map.setCenter(pos);
		var marker = new google.maps.Marker({
			map: map,
			title: "Center Location",
			position: pos,
		});
		markers.push(marker);
	}

	function createPositionArr(lat,lng){
		var x={"lat":parseFloat(lat),"lng":parseFloat(lng)};
		return x;
	}

	function getCurrentLoc(callback){
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude

				};

				callback(pos);



			}, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			});
		} else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
      }
  }
  
  function clearOverlays() {
  	for (var i = 0; i < markers.length; i++ ) {
  		markers[i].setMap(null);
  	}
  	markers.length = 0;
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  	infoWindow.setPosition(pos);
  	infoWindow.setContent(browserHasGeolocation ?
  		'Error: The Geolocation service failed.' :
  		'Error: Your browser doesn\'t support geolocation.');
  	infoWindow.open(map);
  }


  function initMap() {
  	var PE = {lat: 41.8908348, lng: -87.6272821};
  	map = new google.maps.Map(document.getElementById('map'), {
  		zoom: 12,
  		center: PE,
  		styles:[  {
  			"featureType": "poi",
  			"stylers": [
  			{
  				"visibility": "off"
  			}
  			]
  		},
  		{
  			"featureType": "poi",
  			"elementType": "labels.text",
  			"stylers": [
  			{
  				"visibility": "off"
  			}
  			]
  		}]
  	});
  }


  function httpGet(theUrl,key)
  {
  	var xmlHttp = new XMLHttpRequest();

xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
xmlHttp.setRequestHeader("Ocp-Apim-Subscription-Key",key);
xmlHttp.send( null );
return xmlHttp.responseText;
}

// Changes XML to JSON
function xmlToJson(xml) {

// Create the return object
var obj = {};

if (xml.nodeType == 1) { // element
// do attributes
if (xml.attributes.length > 0) {
//obj["attributes"] = {};
for (var j = 0; j < xml.attributes.length; j++) {
	var attribute = xml.attributes.item(j);
//obj["attributes"][attribute.nodeName] = attribute.nodeValue;
obj[attribute.nodeName] = attribute.nodeValue;
}
}
} else if (xml.nodeType == 3) { // text
obj = xml.nodeValue.trim(); // add trim here
}

// do children
if (xml.hasChildNodes()) {
	for(var i = 0; i < xml.childNodes.length; i++) {
		var item = xml.childNodes.item(i);
		var nodeName = item.nodeName;
		if (typeof(obj[nodeName]) == "undefined") {
			var tmp = xmlToJson(item);
if(tmp != "") // if not empty string
	obj[nodeName] = tmp;
} else {
	if (typeof(obj[nodeName].push) == "undefined") {
		var old = obj[nodeName];
		obj[nodeName] = [];
		obj[nodeName].push(old);
	}
	var tmp = xmlToJson(item);
if(tmp != "") // if not empty string
	obj[nodeName].push(tmp);
}
}
}
return obj;
}