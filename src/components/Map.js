import React, { useEffect, useRef, useState } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby-plugin-modal-routing-4'
const Map = ({ location }) => {
  const mapRef = useRef(null);
  const searchRef = useRef(null);
  const [map, setMap] = useState(null);
  const [measureTool, setMeasureTool] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [center, setCenter] = useState({ lat: 30.38, lng: -89.03 });
  const [zoom, setZoom] = useState(12);
  const [totalArea, setTotalArea] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [inverted, setInverted] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const googleMapsApiKey = process.env.GATSBY_GOOGLE_MAPS_API_KEY;
  const mapStyle = [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'on' }] },
  ];

  const updateQueryString = (lat, lng, zoom, search) => {
    const params = new URLSearchParams(location.search);
    params.set('lat', lat);
    params.set('lng', lng);
    params.set('zoom', zoom);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const loadGoogleMapsScript = () => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry,drawing,places`;
    googleMapsScript.async = true; // Load asynchronously
    googleMapsScript.defer = true; // Ensure it's deferred
    googleMapsScript.onload = () => {
      setIsGoogleLoaded(true);
      setIsLoading(false);
    };
    document.body.appendChild(googleMapsScript);
  };

  const initMap = () => {
    const params = new URLSearchParams(location.search);
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    const initialZoom = parseInt(params.get('zoom'), 11);
    const search = params.get('search');

    const initialCenter = { lat: lat || 30.38, lng: lng || -89.03 };
    const initialZoomLevel = initialZoom || 11;

    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: initialZoomLevel,
      mapTypeId: window.google.maps.MapTypeId.HYBRID,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      scaleControl: false,
      zoomControl: false,
      tilt: 0,
      styles: mapStyle,
    });

    const googleMeasureTool = new window.MeasureTool(googleMap, {
      contextMenu: false,
      unit: 'imperial',
    });

    const googleGeocoder = new window.google.maps.Geocoder();

    setMap(googleMap);
    setMeasureTool(googleMeasureTool);
    setGeocoder(googleGeocoder);

    googleMap.addListener('center_changed', () => {
      const newCenter = googleMap.getCenter().toJSON();
      setCenter(newCenter);
      updateQueryString(newCenter.lat, newCenter.lng, googleMap.getZoom(), searchQuery);
    });

    googleMap.addListener('zoom_changed', () => {
      const newZoom = googleMap.getZoom();
      setZoom(newZoom);
      updateQueryString(googleMap.getCenter().lat(), googleMap.getCenter().lng(), newZoom, searchQuery);
    });

    googleMeasureTool.addListener('measure_end', (e) => {
      if (e.result && e.result.area) {
        const sqFeet = e.result.area.sqft;
        setTotalArea(sqFeet);
      }
    });

    if (search) {
      setSearchQuery(search);
      searchRef.current.value = search; // Set initial value for search input
    }

    const autocomplete = new window.google.maps.places.Autocomplete(searchRef.current);
    autocomplete.bindTo('bounds', googleMap);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }
      googleMap.setCenter(place.geometry.location);
      googleMap.setZoom(21); // Zoom to max level
      setCenter(place.geometry.location.toJSON());
      setZoom(21);
      setSearchQuery(place.formatted_address);
      updateQueryString(place.geometry.location.lat(), place.geometry.location.lng(), 21, place.formatted_address);
    });

    // Redraw the map on search
    window.google.maps.event.trigger(googleMap, 'resize');
  };

  useEffect(() => {
    const measureToolScript = document.createElement('script');
    measureToolScript.src = '/dist/gmaps-measuretool.umd.js';
    measureToolScript.async = true;
    measureToolScript.onload = () => {
      loadGoogleMapsScript();
    };
    document.body.appendChild(measureToolScript);

    return () => {
      document.body.removeChild(measureToolScript);
    };
  }, []);

  useEffect(() => {
    if (isGoogleLoaded) {
      initMap();
    }
  }, [isGoogleLoaded]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    const zoom = parseInt(params.get('zoom'), 10);
    const search = params.get('search');

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
      setCenter({ lat, lng });
      setZoom(zoom);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  const handleInvert = () => {
    if (measureTool) {
      setInverted(!inverted);
      measureTool.setOption('invertColor', !inverted);
    }
  };

  const handleMeasureStart = () => {
    if (measureTool) {
      measureTool.start();
    }
  };

  const handleMeasureEnd = () => {
    if (measureTool) {
      measureTool.end();
    }
  };

  const handleSearchChange = () => {
    setSearchQuery(searchRef.current.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="virtualtour" ref={mapRef} style={{ width: '100%', height: '100dvh', position: 'relative' }}></div>

      <div style={{ position: 'absolute', top: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', background:'rgba(0,0,0,0.50)', maxWidth:'', margin:'0 auto', padding:'0 0 4px 0' }}>

      <Link to="/" aria-label="Link to Top" title="Back to Top" style={{textDecoration:'none', borderBottom:'0'}}>
        <StaticImage
          className="logo1"
          src="../../static/assets/Cuttr-logo-wht.svg"
          alt="Default Image"
          style={{ height: 'auto', maxWidth: '150px', position: '', top: '', left: '', zIndex: 1, borderRadius: '2%', opacity: '0.9', background: 'transparent', margin: '0 2vw 0 1vw', opacity:'.8', }}
        />
        </Link>

        <input
          ref={searchRef}
          type="text"
          placeholder="Enter your address"
          style={{ width: '80%', maxWidth: '300px', marginTop:'', padding: '5px', borderRadius: '3px', border: '1px solid #ccc', color: '#222', opacity:'.8' }}
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <button className="button font" style={{ padding: '1vh 2vw', fontSize: 'clamp(.7rem,2vw,2.2rem)' }} onClick={handleMeasureStart}>Size Yard</button>

        <button className="button" style={{ padding: '1vh 5px', fontSize: 'clamp(.7rem,1.4vw,2.2rem)', background: '#222', color: '#fff', border: '1px solid #999' }} onClick={handleMeasureEnd}>Clear</button>


      </div>
      
      <div style={{ position: 'absolute', bottom: '14vh', left: '1vw', background: '#fff', padding: '4px 10px', display:'flex', alignItems:'center', borderRadius: '3px', opacity: '.8', zIndex: '10', color:'#222', fontSize: 'clamp(.7rem,1vw,2.2rem)' }}>
        <input type="checkbox" id="invertColor" checked={inverted} onChange={handleInvert} />
        <label htmlFor="invertColor" style={{ marginLeft: '5px' }}>Invert Text</label>
      </div>

      <Link to='/contact' state={{modal: true}} className="print hover" style={{ display: 'flex',  color: '#fff', alignItems:'center', padding:'1vh 3vw', maxWidth:'', minWidth:'', margin:'2px auto', textDecoration:'underline', borderRadius:'12px', margin:'5px auto 0 auto', textAlign:'center', fontSize:'clamp(1rem, 1.2vw, 2rem)', background: 'rgba(0,0,0,0.90)',  backdropFilter: 'blur(4px)', border:'1px solid #333' }}>
      <div className="button glow font" style={{ position: 'absolute', bottom: '6vh', right: '0', background: '', padding: '2vh 2vw', display:'flex', alignItems:'center', borderRadius: '3px', opacity: '.9', zIndex: '10', color:'#222', fontSize: 'clamp(1.3rem,2.5vw,3.2rem)', fontWeight:'900' }}>
    Cut My Grass!
      </div>
      </Link>

    </>
  );
};

export default Map;
