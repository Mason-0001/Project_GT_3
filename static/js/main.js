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

// create Legend for map
function createLegend() {
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
  return legend
}

// Create Map
function createMap() {
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

  // Create our map, giving it the streetmap and tornado layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [topo]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, null, {
    collapsed: false
  }).addTo(myMap);
  console.log("Layer control added to map");
  return myMap;
}

function getDatesByYear(features, year) {
  year = parseInt(year);
  return features.filter(obj => new Date(obj.properties.date).getFullYear() === year);
  }
    
function createMarkers(filtFeatures)  {
  function createMarker(feature) {
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
      marker.bindPopup(`<h3>${feature.properties.date}</h3><hr><p>${new Date(feature.properties.date)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Coordinates: ${[feature.properties.slat, feature.properties.slon]}</p>`);
      // Return the marker object.
      return marker;
  }
  return filtFeatures.map(createMarker);
}



function createYearSelector() {
  // Code for dropdown menu that updates map
  // Get a reference to the year selector element.
  var yearSelector = document.getElementById("year-selector");

  // Loop through the years from 2007 to 2021.
  for (var year = 2007; year <= 2021; year++) {
      // Create an option element for the year.
      var option = document.createElement("option");
      option.value = year;
      option.text = year;
      // Append the option element to the year selector element.
      yearSelector.appendChild(option);
  }
  return yearSelector
}

// Perform a GET request to the query URL/
d3.json("/api/geojson").then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  map = createMap();
  createLegend().addTo(map);
  yearSel = createYearSelector();
  var markersLayer = L.layerGroup();
  markersLayer.addTo(map);
  // Add an event listener to the year selector element.
  yearSel.addEventListener("change", function () {
      // Get the selected year from the year selector element.
      var selectedYear = yearSel.value;
      // Update the map with the selected year.
      filtFeatures = getDatesByYear(data["features"], selectedYear)

      markers = createMarkers(filtFeatures);
      markersLayer.clearLayers();
      markers.map(m => m.addTo(markersLayer))
  });

});