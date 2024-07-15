import React, { useState, useEffect } from 'react';
import Seo from '../components/seo';
import Layout from '../components/siteLayout';
import Map from '../components/Map';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router'; // Import useLocation hook
// import { MdOutlineIosShare } from "react-icons/md";
import FrontLoader from '../../static/assets/laser-grid.svg'
// import PWA from '../components/PwaInstaller'
import { StaticImage } from 'gatsby-plugin-image';
const IndexPage = () => {
  const location = useLocation(); // Use useLocation hook to get location
  const [mapData, setMapData] = useState(null);

  const handleMapUpdate = (data) => {
    setMapData(data);
  };



  return (
    <Layout>
      <Helmet>
        <body id="body" className="homepage install noscroll map" style={{ overflow: 'hidden', paddingTop:'' }} />
  
      </Helmet>
  

      <Seo
      title="Cuttr - Lawn Care Made Easy"
      description="Discover the simplicity of yard sharing to get your lawn serviced on demand"
      image='https://cuttr.app/assets/default-og-image.webp'
    />

{/* 
<FrontLoader className="" style={{
                    animation:'gridfadeout',
                    animationDuration:'6s',
                    animationDelay:'0',
                    opacity:'0',
                    animationFillMode:'normal',
                    background:'rgba(0,0,0,0.90)',
                    position:'absolute',
                    zIndex:'1',
                    right:'0',
                    left:'0',
                    top:'10vh',
                    width:'100vw',
                    height:'100vh',
                    // display:'grid',
                    // placeContent:'center',
                    fontWeight:'bold', padding:'.3rem', color:'#999', fontSize:'1rem',  borderRadius:'8px', border:'1px solid #666', cursor:'pointer',
                }} /> */}


      <section className="outer section spud2">
        <div className="container spud" style={{ padding: '0', height: 'calc(100dvh - 60px)', position:'relative' }}>
    

          
        

{/* <StaticImage src="../../static/assets/laser-grid.svg" alt="Default Image" style={{height:'auto', maxHeight:'100vh', position:'absolute', zIndex:'1', top:'0',border:'0px solid !important', objectFit:'contain', margin:'0 auto',
                    animation:'gridfadeout',
                    animationDuration:'3s',
                    animationDelay:'0',
                    opacity:'0',
                    animationFillMode:'normal',}} /> */}
    
          {/* <Map location={location} onMapUpdate={handleMapUpdate} /> */}

          <iframe title="location1 map1" className="flexcheek" width="100vw" height="100dvh" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://cuttr.app/maptest/" allowFullScreen={true} loading="lazy" origin="https://cuttr.app" style={{maxWidth:'100%', minWidth:'100%', minHeight:'100dvh', margin:'0 auto', border:'.5vw solid rgba(0,0,0,0.60)', borderRadius:'12px'}}></iframe>


        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;
