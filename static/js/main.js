// Determine the color of the marker based on the Magnitude.
function getColor(EFscale) {
    if (EFscale < 1) {
      return "#00FF00"; // green
    } else if (EFscale <= 1) {
      return "#ADFF2F"; // green-yellow
    } else if (EFscale <= 2) {
      return "#FFFF00"; // yellow
    } else if (EFscale <= 3) {
      return "#FFA500"; // orange
    } else if (EFscale <= 4) {
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
        div.innerHTML += '<i style="background:#00FF00"></i> =0<br>';
        div.innerHTML += '<i style="background:#ADFF2F"></i> 1<br>';
        div.innerHTML += '<i style="background:#FFFF00"></i> 2<br>';
        div.innerHTML += '<i style="background:#FFA500"></i> 3<br>';
        div.innerHTML += '<i style="background:#FF4500"></i> 4<br>';
        div.innerHTML += '<i style="background:#FF0000"></i> 5<br>';
  
        return div;
    };
    return legend
  }
  
  // Create Map
  function createMap() {
    // Create the base layers.
  
    var natGeo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        maxZoom: 16
    });
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    var street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Topographic Map": topo,
      "National Geographic Map": natGeo,
      "Street Map": street
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
    return myMap;
  }
  
  // make a function to all data in selected year.
  function getDatesByYear(features, year) {
    year = parseInt(year);
    return features.filter(obj => new Date(obj.properties.date).getFullYear() === year);
    }
  
  // make markers function
  function createMarkers(filtFeatures)  {
    function createMarker(feature) {
        var size = feature.properties.lmiles / 2;
        // Create the marker object using the feature's coordinates.
        var marker = L.circleMarker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
            color: "#000000",
            fillColor: getColor(feature.properties.EFscale),
            fillOpacity: 1.0,
            radius: size,
            weight: 1
        });
  
        // Add a popup to the marker.
        marker.bindPopup(`<h3>${feature.properties.date}</h3><hr><p>EF Scale: ${feature.properties.EFscale}</p><p>Injuries: ${feature.properties.injuries}</p><p>Fatalities: ${[feature.properties.fatalities]}</p><p>Property Loss: $${feature.properties.propertyloss}</p><p>Width in Yards: ${feature.properties.wyards}</p>`);
        // Return the marker object.
        return marker;
    }
    return filtFeatures.map(createMarker);
  }
  
  
  // make a function to create the year selector
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
    // Create heatmap config.
    var cfg = {
      "radius": 5,
      "maxOpacity": .8, 
      "scaleRadius": true, 
      "useLocalExtrema": false,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count'
    };
    
    // Create Heatmap function.
    function createHeatmapLayer(data) {
      var heatmapLayer = new HeatmapOverlay(cfg);
    //   console.log(heatmapLayer)
      // Define an empty list to store the extracted data
      var ndata = [];
  
      // Iterate over the features and extract the desired fields (need to do this for the .setData)
      for (var i = 0; i < data.length; i++) {
        var feature = data[i];
        var lat = feature.properties.slat;
        var lng = feature.properties.slon;
        var value = feature.properties.EFscale;
        
        // Create a dictionary with the extracted fields and append it to the data list
        ndata.push({lat: lat, lng: lng, count: value});
      }
      heatDict = {
        max: ndata.length,
        data: ndata
      }
  
      heatmapLayer.setData(heatDict);
      return heatmapLayer;
    }
  
    // Create path chart layer
    function createPathLayer(filtFeatures) {
      function createPaths(feature) {
        // console.log(filtFeatures)
      var line = [
        [feature.properties.slat, feature.properties.slon],
        [feature.properties.elat, feature.properties.elon]
      ];
    //   console.log(line)
      var path = L.polyline(line, {
        color: "blue"
      })
      return path
    }
    return filtFeatures.map(createPaths);
  }
  // Perform a GET request to the query URL/
  d3.json("/api/geojson").then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    map = createMap();
    // console.log(data)
    createLegend().addTo(map);
    yearSel = createYearSelector();
    
    // create layers on map
    var markersLayer = L.layerGroup();
    var heatmapLayer = createHeatmapLayer([]);
    var pathLayer = L.layerGroup()
    markersLayer.addTo(map);
    heatmapLayer.addTo(map);
    
    // Add an event listener to the year selector element.
    yearSel.addEventListener("change", function () {
        // Get the selected year from the year selector element.
        // Create a layer control object and add it to the map.
  
        var selectedYear = yearSel.value;
        // Update the map with the selected year.
  
        filtFeatures = getDatesByYear(data["features"], selectedYear);
        markers = createMarkers(filtFeatures);
        paths = createPathLayer(filtFeatures);
        markersLayer.clearLayers();
        pathLayer.clearLayers();
  
  
        if (filtFeatures.length > 0) {
          map.removeLayer(heatmapLayer);
          heatmapLayer = createHeatmapLayer(filtFeatures);
          heatmapLayer.addTo(map);
        }
        var nodes = d3.selectAll(".leaflet-control-layers").nodes()
        if (nodes.length > 1) {
          d3.select(nodes[1]).remove()
        }
        var overlayMaps = {
          "Tornado Markers": markersLayer,
          "Tornado Heatmap": heatmapLayer,
          "Tornado Paths": pathLayer
          };
          L.control.layers(null, overlayMaps, {collapsed: false}).addTo(map);
        markers.map(m => m.addTo(markersLayer))
        paths.map(m=> m.addTo(pathLayer))
    });
  
  });