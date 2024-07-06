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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('mapData', JSON.stringify(mapData));
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.ok) {
        alert('Successfully registered!');
      } else {
        alert('Registration failed.');
      }
    });
  };

  return (
    <Layout>
      <Helmet>
        <body id="body" className="homepage install noscroll" style={{ overflow: 'hidden' }} />
      </Helmet>
      <Seo title="Map Registration" />
      <section className="outer section">
        <div className="container" style={{ padding: '0', minHeight: '100vh' }}>
          <Map location={location} onMapUpdate={handleMapUpdate} />
          <form onSubmit={handleFormSubmit} style={{ height: '30px', padding: '4px 10px' }}>
            <label>
              Name:
              <input type="text" name="name" required />
            </label>
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
            <button type="submit">Register</button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;
