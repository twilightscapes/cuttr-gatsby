import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapTest = ({ location }) => {
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapStyle = {
    width: '100vw',
    height: '100vh',
    position: 'relative',
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        console.log('Map clicked at:', e.latlng);
      },
    });
    return null;
  };

  useEffect(() => {
    if (map) {
      console.log('Map instance:', map);
      setIsLoading(false);
    }
  }, [map]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={[30.38, -89.03]}
        zoom={12}
        style={mapStyle}
        whenCreated={(mapInstance) => {
          console.log('Map created:', mapInstance);
          setMap(mapInstance);
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default MapTest;
