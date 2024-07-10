import React, { useState, useEffect } from 'react';
import Seo from '../components/seo';
import Layout from '../components/siteLayout';
import Map from '../components/Map';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router'; // Import useLocation hook

const IndexPage = () => {
  const location = useLocation(); // Use useLocation hook to get location
  const [mapData, setMapData] = useState(null);

  const handleMapUpdate = (data) => {
    setMapData(data);
  };



  return (
    <>
      <Helmet>
        <body id="body" className="homepage1 install noscroll" style={{ overflow: 'hidden', paddingTop:'' }} />
  
      </Helmet>
      <Seo title="DogPoopers YardStick" />
      <section className="outer section">
        <div className="container" style={{ padding: '0', height: 'calc(100vh - 60px)', position:'relative' }}>
          <Map location={location} onMapUpdate={handleMapUpdate} />
        </div>
      </section>
    </>
  );
};

export default IndexPage;
