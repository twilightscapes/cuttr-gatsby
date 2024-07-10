import React, { useState, useEffect } from 'react';
import Seo from '../components/seo';
import Layout from '../components/siteLayout';
import Map from '../components/Map';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router'; // Import useLocation hook
// import { MdOutlineIosShare } from "react-icons/md";
import FrontLoader from '../../static/assets/grid-loader.svg'
// import PWA from '../components/PwaInstaller'

const IndexPage = () => {
  const location = useLocation(); // Use useLocation hook to get location
  const [mapData, setMapData] = useState(null);

  const handleMapUpdate = (data) => {
    setMapData(data);
  };



  return (
    <Layout>
      <Helmet>
        <body id="body" className="homepage install noscroll" style={{ overflow: 'hidden', paddingTop:'' }} />
  
      </Helmet>
  

      <Seo
      title="Cuttr - Lawn Care Made Easy"
      description="Discover the simplicity of yard sharing to get your lawn serviced on demand"
      image='https://cuttr.app/assets/default-og-image.webp'
    />





      <section className="outer section spud2">
        <div className="container spud" style={{ padding: '0', height: 'calc(100vh - 60px)', position:'relative' }}>
    

          {/* <FrontLoader style={{
                    animation:'loader',
                    animationDuration:'3s',
                    animationDelay:'7s',
                    opacity:'.3',
                    animationFillMode:'forwards',
                    position:'absolute',
                    zIndex:'1',
                    right:'',
                    top:'',
                    width:'100vw',
                    display:'grid',
                    placeContent:'center',
                    fontWeight:'bold', padding:'.3rem', color:'#999', fontSize:'1rem',  borderRadius:'8px', border:'1px solid #666', cursor:'pointer',
                }} /> */}
    
          <Map location={location} onMapUpdate={handleMapUpdate} />
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;
