// Store the API endpoint as queryUrl.
var queryUrl = "/api/geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data);
});

function createFeatures(tornadoData) {
    console.log(tornadoData)
// Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, time, and mag of the tornado.
  function onEachFeature(feature, layer) {
    const date = feature.properties.date;
    const time = feature.properties.time;
    const mag = feature.properties.mag;

    // starting Lat and Lon and ending Lat and Lon
    const slat = feature.properties.slat;
    const slon = feature.properties.slon;
    const elat = feature.properties.elat;
    const elon = feature.properties.elon;
    const latlng = [feature.properties.elat, feature.properties.elon];

    layer.bindPopup(`<h3>Tornado Details</h3>
      <p>Date: ${date}</p>
      <p>Time: ${time}</p>
      <p>Magnitude: ${mag}</p>
      <p>Coordinates: ${slat}, ${slon}</p>
    `);
  }
      // Determine the color of the marker based on the Magnitude.

    function getColor(mag) {
        if (mag <= 1) {
          return "#00FF00"; // green
        } else if (mag <= 1.5) {
          return "#ADFF2F"; // green-yellow
        } else if (mag <= 2) {
          return "#FFFF00"; // yellow
        } else if (mag <= 3) {
          return "#FFA500"; // orange
        } else if (mag <= 4) {
          return "#FF4500"; // orange-red
        } else {
          return "#FF0000"; // red
        }
      }
      // Define a function to create the markers for each tornado feature.
      function createMarker(feature) {

        // Get the year from the feature's time property.
        var year = new Date(feature.properties.date).getFullYear();
              
        // Check if the year matches the selected year.
        if (year === 2017) {
          // Determine the size of the marker based on the magnitude.
          var size = feature.properties.mag * 3;
      
          // Create the marker object using the feature's coordinates.
          var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            color: "#000000",
            fillColor: getColor(feature.properties.mag),
            fillOpacity: 1.0,
            radius: size,
            weight: 1
          });
      
          // Add a popup to the marker.
          marker.bindPopup(`<h3>${feature.properties.date}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Coordinates: ${[feature.properties.slat, feature.properties.slon]}</p>`);
          // Return the marker object.
          return marker;
        }
      }
// Create a GeoJSON layer that contains the features array on the tornadoData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var tornados = L.geoJSON(tornadoData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarker
  });

// Create a legend control and add it to the map.
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.style.backgroundColor = 'darkgrey'; // Set background color to white
  
  // Add HTML for legend with colored boxes
  div.innerHTML += '<i style="background:#00FF00"></i> <=1<br>';
  div.innerHTML += '<i style="background:#ADFF2F"></i> 1-1.5<br>';
  div.innerHTML += '<i style="background:#FFFF00"></i> 1.5-2<br>';
  div.innerHTML += '<i style="background:#FFA500"></i> 2-3<br>';
  div.innerHTML += '<i style="background:#FF4500"></i> 3-4<br>';
  div.innerHTML += '<i style="background:#FF0000"></i> 4+<br>';

  return div;
};

    // Send our tornados layer to the createMap function/
  createMap(tornados);

  function createMap(tornados) {
    console.log("createMap function called");
    // Create the base layers.

    var natGeo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        maxZoom: 16
    });
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Topographic Map": topo,
      "National Geographic Map": natGeo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      tornados: tornados
    };
  
    // Create our map, giving it the streetmap and tornado layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [topo, tornados]
    });
    console.log(myMap);
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    console.log("Layer control added to map");
legend.addTo(myMap);
  }

}