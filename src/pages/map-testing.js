import React from 'react';
import Seo from '../components/seo';
import Layout from '../components/siteLayout';
import MapTest from '../components/MapTest';
import { Helmet } from 'react-helmet';

const IndexPage = () => {
  return (
    <Layout>
      <Helmet>
        <body id="body" className="homepage noscroll install" style={{ overflow: 'hidden' }} />
      </Helmet>
      <Seo title="Cuttr Map" />
      <section className="outer section">
        <div className="container" style={{ padding: '0', minHeight: '' }}>
          {typeof window !== 'undefined' && <MapTest />}
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;
