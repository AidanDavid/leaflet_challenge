// logic.js

// URL to the earthquake dataset (replace with the actual dataset URL)
const earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map object
const map = L.map('map').setView([20, 0], 2); // Centered globally with an appropriate zoom level

// Add a tile layer (background map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
  return magnitude ? magnitude * 4 : 2; // Scale factor for better visibility
}

// Function to determine marker color based on depth
function getMarkerColor(depth) {
  return depth > 90 ? '#d73027' :
         depth > 70 ? '#fc8d59' :
         depth > 50 ? '#fee08b' :
         depth > 30 ? '#d9ef8b' :
         depth > 10 ? '#91cf60' :
                      '#1a9850';
}

// Fetch the earthquake data
fetch(earthquakeDataUrl)
  .then(response => response.json())
  .then(data => {
    // Add markers to the map
    data.features.forEach(feature => {
      const [longitude, latitude, depth] = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const place = feature.properties.place;

      // Create a circle marker
      const marker = L.circleMarker([latitude, longitude], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(depth),
        color: '#000', // Border color
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });

      // Add a popup to the marker
      marker.bindPopup(
        `<h3>${place}</h3>
         <p>Magnitude: ${magnitude}</p>
         <p>Depth: ${depth} km</p>`
      );

      // Add marker to the map
      marker.addTo(map);
    });

    // Add a legend to the map
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [-10, 10, 30, 50, 70, 90];
      const colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'];

      div.innerHTML += '<h4>Depth (km)</h4>';
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML += 
          `<i style="background:${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? '&ndash;' + depths[i + 1] : '+'}<br>`;
      }
      return div;
    };

    legend.addTo(map);
  })
  .catch(error => console.error('Error fetching earthquake data:', error));
