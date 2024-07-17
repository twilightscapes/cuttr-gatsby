import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as turf from '@turf/turf';
import { useLocation } from '@reach/router';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

// Import marker icon images (adjust paths as necessary)
import markerIconUrl from '../../static/assets/Cuttr-icon.png';
import markerIconShadowUrl from '../../static/assets/Cuttr-icon.png';

// Create marker icon instances
const markerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerIconShadowUrl,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const MapTest = () => {
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());
  const markersRef = useRef(new L.LayerGroup());
  const [map, setMap] = useState(null);
  const [areaText, setAreaText] = useState('');
  const [zoomLevel, setZoomLevel] = useState(12); // Default zoom level
  const location = useLocation();

  useEffect(() => {
    const initializeMap = () => {
      const params = new URLSearchParams(location.search);
      const latParam = parseFloat(params.get('lat'));
      const lngParam = parseFloat(params.get('lng'));
      const zoomParam = parseInt(params.get('zoom'), 10);

      const initialZoom = zoomParam || 12;
      const defaultCenter = [latParam || 30.38, lngParam || -89.03];

      const initialMap = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: initialZoom,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 21,
          }),
          L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 21,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }),
        ],
      });

      initialMap.addLayer(drawnItemsRef.current);
      initialMap.addLayer(markersRef.current);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItemsRef.current,
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: false, // Hide area measurement
          },
          polyline: false,
          marker: false,
          circle: false,
          circlemarker: false,
          rectangle: false, // Disable rectangle drawing
        },
      });

      initialMap.addControl(drawControl);
      initialMap.zoomControl.remove(); // Remove zoom control

      setMap(initialMap);

      if (latParam && lngParam) {
        initialMap.setView([latParam, lngParam], zoomParam || 21);
        setZoomLevel(zoomParam || 21);
      }
    };

    if (!map) {
      initializeMap();
    }
  }, [map, location.search]);

  const updateQueryString = () => {
    if (!map) return;
    const bounds = drawnItemsRef.current.toGeoJSON();
    const params = new URLSearchParams(location.search);
    params.set('bounds', encodeURIComponent(JSON.stringify(bounds)));
    params.set('zoom', map.getZoom().toString());
    params.set('lat', map.getCenter().lat.toString());
    params.set('lng', map.getCenter().lng.toString());
    params.set('address', document.getElementById('address').value);

    // Check if window is defined before using history API
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
    }
  };

  useEffect(() => {
    if (map) {
      updateQueryString();
    }
  }, [map, location.search]);

  const calculateArea = () => {
    let totalArea = 0;
    drawnItemsRef.current.eachLayer(function (layer) {
      const geojson = layer.toGeoJSON();
      let area = 0;
      if (geojson.geometry.type === 'Polygon') {
        area = turf.area(geojson);
      }
      totalArea += area;
    });

    const totalAreaSqFt = totalArea * 10.7639;
    const costPerSqFt = calculateCostPerSqFt(totalAreaSqFt);
    const totalCost = totalAreaSqFt * costPerSqFt;

    let areaText = 'Total Area: ' + totalAreaSqFt.toFixed(2) + ' sq ft<br>';
    areaText += 'Cost per sq ft: $' + (costPerSqFt ? costPerSqFt.toFixed(2) : 'N/A') + '<br>';
    areaText += 'Cost: $' + totalCost.toFixed(2);

    if (totalAreaSqFt > 10000) {
      areaText += '<br><span style="color: red;">Custom quote required for areas over 10,000 sq ft.</span>';
    }

    setAreaText(areaText);
    const costInput = document.getElementById('cost');
    if (costInput) {
      costInput.value = totalCost.toFixed(2);
    }
  };

  const calculateCostPerSqFt = (areaSqFt) => {
    if (areaSqFt <= 1500) {
      return 0.08;
    } else if (areaSqFt <= 4000) {
      return 0.05;
    } else if (areaSqFt <= 20000) {
      return 0.03;
    } else {
      return null;
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const address = document.getElementById('address').value.trim();
    if (map && address) {
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(address, (results) => {
        if (results.length > 0) {
          const { lat, lng } = results[0].center;
          const addressMarker = L.marker([lat, lng], { icon: markerIcon }).addTo(markersRef.current);
          map.setView([lat, lng], 21); // Set view to the first result with zoom level 21
          setZoomLevel(21); // Update state with zoom level

          drawnItemsRef.current.clearLayers(); // Clear drawn shapes
          const drawnMarker = L.marker([lat, lng], { icon: markerIcon }).addTo(drawnItemsRef.current); // Add marker at drawn shape center

          updateQueryString();
          calculateArea();
        } else {
          console.error('No geocoding results found for:', address);
        }
      });
    }
  };

  useEffect(() => {
    if (map) {
      map.on('moveend', () => {
        updateQueryString();
      });

      map.on('zoomend', () => {
        updateQueryString();
      });

      map.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItemsRef.current.addLayer(layer);
        const center = layer.getBounds().getCenter(); // Get center of drawn shape
        const centerMarker = L.marker(center, { icon: markerIcon }).addTo(markersRef.current); // Add marker at center of drawn shape
        updateQueryString();
        calculateArea();
      });

      map.on(L.Draw.Event.EDITED, () => {
        updateQueryString();
        calculateArea();
      });

      map.on(L.Draw.Event.DELETED, () => {
        updateQueryString();
        calculateArea();
      });
    }
  }, [map]);

  const loadFromQueryString = () => {
    const params = new URLSearchParams(location.search);
    const boundsParam = params.get('bounds');
    const zoomParam = params.get('zoom');
    const latParam = params.get('lat');
    const lngParam = params.get('lng');
    const addressParam = params.get('address');

    if (boundsParam) {
      const bounds = JSON.parse(decodeURIComponent(boundsParam));
      const geojsonLayer = L.geoJSON(bounds);
      drawnItemsRef.current.clearLayers();
      geojsonLayer.eachLayer(function (layer) {
        drawnItemsRef.current.addLayer(layer);
      });
    }
    if (zoomParam) {
      setZoomLevel(parseInt(zoomParam, 10));
    }
    if (latParam && lngParam) {
      map.setView([parseFloat(latParam), parseFloat(lngParam)]);
    }
    if (addressParam) {
      document.getElementById('address').value = decodeURIComponent(addressParam);
    }
    calculateArea();
  };

  useEffect(() => {
    if (map) {
      loadFromQueryString();
    }
  }, [map]);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            background: '#fff',
            alignItems: 'center',
          }}
        >
          <input
            id="address"
            type="text"
            placeholder="Enter your address"
            style={{ width: '380px', marginBottom: '10px', padding: '5px' }}
          />
          <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '5px 10px' }}>
            Search
          </button>
        </div>
        <div
          id="map"
          ref={mapRef}
          style={{ width: '100%', height: '500px', position: 'relative', zIndex: '0' }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: '1000',
            background: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          dangerouslySetInnerHTML={{ __html: areaText }}
        ></div>
      </div>
    </div>
  );
};

export default MapTest;
