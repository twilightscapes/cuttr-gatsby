import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as turf from '@turf/turf';
import { useLocation } from '@reach/router';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

const MapTest = () => {
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null); // Ensure it's initialized properly later
  const markersRef = useRef(null); // Ensure it's initialized properly later
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

      drawnItemsRef.current = L.featureGroup(); // Initialize FeatureGroup correctly
      markersRef.current = L.layerGroup(); // Initialize LayerGroup correctly

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

  // Other useEffects and functions remain the same

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {/* Your JSX for map rendering */}
      </div>
    </div>
  );
};

export default MapTest;
