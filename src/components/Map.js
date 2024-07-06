/* global google */
import React, { useEffect, useRef, useState } from 'react';
import { StaticImage } from "gatsby-plugin-image";

const Map = ({ location }) => {
  const mapRef = useRef(null);
  const searchRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [area, setArea] = useState(0);
  const [distance, setDistance] = useState(0);

  const mapStyle = [
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
    { "featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "on" }] }
  ];

  const updateQueryString = (lat, lng, zoom, shapes, search) => {
    const params = new URLSearchParams(location.search);
    params.set('lat', lat);
    params.set('lng', lng);
    params.set('zoom', zoom);
    params.set('drawnShapes', JSON.stringify(shapes));
    params.set('search', search);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const updateAreaAndDistance = () => {
    if (typeof google !== 'undefined') {
      let totalArea = 0;
      let totalDistance = 0;

      drawnShapes.forEach((shape) => {
        const path = shape.map((point) => new google.maps.LatLng(point.lat, point.lng));
        const area = google.maps.geometry.spherical.computeArea(new google.maps.MVCArray(path));
        totalArea += area;
        
        // Convert area from square meters to square feet (1 sq meter = 10.7639 sq feet)
        const areaFeet = area * 10.7639;

        for (let i = 0; i < path.length - 1; i++) {
          totalDistance += google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i + 1]);
        }
      });

      setArea(totalArea);
      setDistance(totalDistance);
    }
  };

  const handleOverlayComplete = (event) => {
    if (typeof google !== 'undefined') {
      const newShape = event.overlay;
      if (newShape.type === 'polygon') {
        const path = newShape.getPath().getArray().map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));
        const updatedShapes = [...drawnShapes, path];
        setDrawnShapes(updatedShapes);
        updateQueryString(center.lat, center.lng, zoom, updatedShapes, searchQuery);
        updateAreaAndDistance();
        
        newShape.getPath().addListener('set_at', () => {
          setDrawnShapes((prevShapes) => {
            const updated = prevShapes.map((item, index) => {
              if (index === prevShapes.length - 1) {
                return item.map((point, i) => ({
                  lat: newShape.getPath().getAt(i).lat(),
                  lng: newShape.getPath().getAt(i).lng(),
                }));
              }
              return item;
            });
            return updated;
          });
          updateAreaAndDistance();
        });

        newShape.getPath().addListener('insert_at', () => {
          setDrawnShapes((prevShapes) => {
            const updated = prevShapes.map((item, index) => {
              if (index === prevShapes.length - 1) {
                return item.map((point, i) => ({
                  lat: newShape.getPath().getAt(i).lat(),
                  lng: newShape.getPath().getAt(i).lng(),
                }));
              }
              return item;
            });
            return updated;
          });
          updateAreaAndDistance();
        });

        newShape.getPath().addListener('remove_at', () => {
          setDrawnShapes((prevShapes) => {
            const updated = prevShapes.map((item, index) => {
              if (index === prevShapes.length - 1) {
                return item.map((point, i) => ({
                  lat: newShape.getPath().getAt(i).lat(),
                  lng: newShape.getPath().getAt(i).lng(),
                }));
              }
              return item;
            });
            return updated;
          });
          updateAreaAndDistance();
        });
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    const initialZoom = parseInt(params.get('zoom'), 10);
    const loadedShapes = JSON.parse(params.get('drawnShapes') || '[]');
    const loadedSearch = params.get('search') || '';

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(initialZoom)) {
      setCenter({ lat, lng });
      setZoom(initialZoom);
    } else {
      setCenter({ lat: 30.38, lng: -89.03 });
      setZoom(12);
    }

    setDrawnShapes(loadedShapes);
    setSearchQuery(loadedSearch);
  }, [location.search]);

  useEffect(() => {
    const loadMap = () => {
      if (!mapLoaded && typeof google !== 'undefined' && mapRef.current) {
        const initialMap = new google.maps.Map(mapRef.current, {
          center: center || { lat: 30.38, lng: -89.03 },
          zoom: zoom || 12,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          styles: mapStyle,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          scaleControl: false,
          zoomControl: false,
          tilt: 0
        });
        setMap(initialMap);
        setMapLoaded(true);

        const drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
          },
          polygonOptions: {
            editable: true,
            draggable: true,
          },
        });
        drawingManager.setMap(initialMap);
        setDrawingManager(drawingManager);

        google.maps.event.addListener(drawingManager, 'overlaycomplete', handleOverlayComplete);

        google.maps.event.addListener(initialMap, 'center_changed', () => {
          if (initialMap.getCenter()) {
            setCenter(initialMap.getCenter().toJSON());
            updateQueryString(initialMap.getCenter().lat(), initialMap.getCenter().lng(), initialMap.getZoom(), drawnShapes, searchQuery);
          }
        });

        google.maps.event.addListener(initialMap, 'zoom_changed', () => {
          setZoom(initialMap.getZoom());
          updateQueryString(initialMap.getCenter().lat(), initialMap.getCenter().lng(), initialMap.getZoom(), drawnShapes, searchQuery);
        });

        if (searchRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(searchRef.current);
          autocomplete.bindTo('bounds', initialMap);
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
              initialMap.setCenter(place.geometry.location);
              initialMap.setZoom(21); // Zoom to level 21
              setCenter(place.geometry.location.toJSON());
              setZoom(21);
              setSearchQuery(searchRef.current.value);
              setSelectedPlace(place);
              updateQueryString(place.geometry.location.lat(), place.geometry.location.lng(), 21, drawnShapes, searchRef.current.value);
              dropPin(place.geometry.location);
            }
          });
        }
      }
    };

    if (typeof google !== 'undefined' && !mapLoaded) {
      loadMap();
    }
  }, [mapLoaded, center, zoom, location.search, drawnShapes, searchQuery]);

  const dropPin = (location) => {
    if (map) {
      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: selectedPlace?.name || '',
        draggable: false,
      });

      setMarkers([...markers, marker]);
    } else {
      console.warn('Map not initialized yet. Marker cannot be dropped.');
    }
  };

  useEffect(() => {
    updateAreaAndDistance();
  }, [drawnShapes]);

  if (!center || !zoom) {
    return null;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', background: '#fff', alignItems: 'center' }}>
        <input
          ref={searchRef}
          type="text"
          placeholder="Enter your address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={() => updateQueryString(center.lat, center.lng, zoom, drawnShapes, searchQuery)}
          style={{ width: '380px', marginBottom: '', padding: '5px' }}
        />
      </div>
      <div className="virtualtour" ref={mapRef} style={{ width: '100%', height: 'calc(100vh - 150px)', position: 'relative', zIndex: '0' }}></div>
      <StaticImage
        className="logo1"
        src="../../static/assets/Cuttr-map.svg"
        alt="Default Image"
        style={{ height: 'auto', maxHeight: '', margin: '0 auto', zIndex: '5' }}
      />
      <div>Total Area: {area.toFixed(2)} sq feet</div>
      <div>Total Distance: {distance.toFixed(2)} meters</div>
    </div>
  );
};

export default Map;
