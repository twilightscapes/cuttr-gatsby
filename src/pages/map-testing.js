import React from 'react';
import Seo from '../components/seo';
import Layout from '../components/siteLayout';
import MapTest from '../components/MapTest';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router'; // Import useLocation hook

const IndexPage = () => {
  const location = useLocation(); // Use useLocation hook to get location

  return (
    <Layout>
      <Helmet>
        <body id="body" className="homepage install noscroll" style={{ overflow: 'hidden', paddingTop: '' }} />
      </Helmet>
      <Seo title="DogPoopers YardStick" />
      <section className="outer section">
        <div className="container" style={{ padding: '0', height: 'calc(100vh - 60px)', position: 'relative', overflow: 'hidden' }}>
          {/* <MapTest location={location} /> */}
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;
