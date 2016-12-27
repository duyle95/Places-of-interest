'use strict';

var Model = [
  {title: 'Gaggui Kaffela', location: {lat: 60.452857, lng: 22.255859}, id: '52bec6ed498e3010a7b617e5'},
  {title: 'Tintå', location: {lat: 60.448902484534784, lng: 22.269996148961322}, id: '4c419c08a48d9c74ada10c40'},
  {title: 'Aurajokiranta', location: {lat: 60.44868372386505, lng: 22.268529515698262}, id: '4bc6e4428b7c9c74b57735cf'},
  {title: 'Kaskis', location: {lat: 60.446658921082374, lng: 22.272548080596717}, id: '4ff0156be4b0dc34768bbaee'},
  {title: 'Ravintola Maneerat', location: {lat: 60.44862601247527, lng: 22.259267511140276}, id: '4f771a45e4b04210826b4af6'},
  {title: 'CaféArt', location: {lat: 60.449405, lng: 22.271087}, id: '4b53080bf964a5200a8d27e3'},
  {title: 'Nuvole Gelateria', location: {lat: 60.45049590914281, lng: 22.265810697617184}, id: '4bc5db2f5935c9b6c574a6d2'},
  {title: 'Pub Niska', location: {lat: 60.44795641580881, lng: 22.266663209443983}, id: '4ff56015e4b0f08304219bdb'},
  {title: 'Tiirikkala', location: {lat: 60.451886303514094, lng: 22.27342877180374}, id: '53b0fa13498e8cd08336b1c3'},
  {title: 'Turku Castle', location: {lat: 60.43549995759725, lng: 22.22905397415161}, id: '4be3d9a6d27a20a1dd29935b'},
  {title: 'Fontana', location: {lat: 60.449612, lng: 22.268206}, id: '4bd16390046076b053c27171'}
];
var map;
var markers =[];


function ViewModel() {

  var self = this;

  var largeInfowindow = new google.maps.InfoWindow();

  var hoverIcon = makeMarkerIcon('ffff00');
  var defaultIcon = makeMarkerIcon('0091ff');
  var clickIcon = makeMarkerIcon('ff00ff');

  //add all marker into 'markers' array
  for( var i = 0; i < Model.length; i++){

    var position = Model[i].location;
    var title = Model[i].title;
    var id = Model[i].id;

    var marker = new google.maps.Marker({
      map,
      position,
      title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id
    });
    markers.push(marker);

    marker.addListener("click", function() {
      this.setIcon(clickIcon);
      toggleBounce(this);
      populateInfoWindow(this, largeInfowindow);
    });

  }

    self.markers = ko.observableArray(markers);
    self.showLocation = ko.observable(true);
    self.showError = ko.observable(false);

    self.clickToAnimate = function(){
      this.setIcon(hoverIcon);
      toggleBounce(this);
      populateInfoWindow(this, largeInfowindow);
    };

    self.searchText = ko.observable('');

    self.searchChange = function(){

      var filterMarkers = markers.filter(function(marker){
        return marker.title.toLowerCase().indexOf(self.searchText().toLowerCase()) !== -1;
      });
      var otherMarkers = markers.filter(function(marker){
        return marker.title.toLowerCase().indexOf(self.searchText().toLowerCase()) === -1;
      });
      if ( filterMarkers.length === 0 ){
        //show error message, show defaults markers and list view
        self.showError(true);
        self.markers(markers);
        self.showLocation(true);
      }
      else {
        //hide error message, show filter markers and filter list views
        self.showError(false);
        self.showLocation(true);
        self.markers(filterMarkers);
        filterMarkers.forEach(function(marker){
          marker.setVisible(true);
        });
        otherMarkers.forEach(function(marker){
          marker.setVisible(false);
        });
      }
};

//add bouncing to markers - stackoverflow
function toggleBounce(marker) {

    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    setTimeout(function () {
      marker.setAnimation(null);
      marker.setIcon(defaultIcon);
    }, 1400);

}

//custom marker
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  //ud864 - Project Code 13
    function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });

        Date.prototype.yyyymmdd = function() {
          var mm = this.getMonth() + 1; // getMonth() is zero-based
          var dd = this.getDate();

          return [this.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join(''); // padding
        };

        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (1 + date.getMonth()).toString();
        var day = date.getDate().toString();

        var address;

        var CLIENT_ID = ''; // add your own foursquare client id
        var CLIENT_SECRET = ''; // add your own foursquare client secret

        var version = year + month + day;
        var base_url = "https://api.foursquare.com/v2/venues";

        var venue_id = marker.id;
        var url = base_url + '/' + venue_id;
        $.ajax({
          url: url,
          dataType: 'json',
          data: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            v: version,
            async: true
          }
        }).then(function(data){
          console.log(data);
          var address = data.response.venue.location.address + ', ' + data.response.venue.location.city + ', ' + data.response.venue.location.country;
          var rating = data.response.venue.rating;
          infowindow.setContent('<div><h3>' + marker.title + '</h3><p>' + address + '</p><p><b>Rating</b>: ' + rating + '</p>');
        }).fail(function(e){
          alert("Errors when retrieving Foursquare API");
        });

        infowindow.open(map, marker);
      }
    }
}
//Function to load map and start up app
function initMap() {

  // add styles to google map
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#66ccff' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ff3300' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#000000' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#660066' },
        { lightness: 0 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#ff0000' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'on' }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#cccccc' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#000000' },
        { lightness: -25 }
      ]
    }
  ];

  map  = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 60.44998, lng: 22.263236},
    zoom: 14,
    styles: styles,
    mapTypeControl: false
  });
 ko.applyBindings(new ViewModel());
}
