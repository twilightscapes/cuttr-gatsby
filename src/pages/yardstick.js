// import React, { useState } from "react";
import React from "react";
import useSiteMetadata from "../hooks/SiteMetadata"
import { StaticImage } from "gatsby-plugin-image"
// import {Link} from "gatsby"
// import styled from "styled-components"
import Layout from "../components/siteLayout"
import { Helmet } from "react-helmet"
// import Intro from "../../static/assets/textual.svg"
// import Intro2 from "../../static/assets/install-intro.svg"
// import Intro3 from "../../static/assets/intro-github.svg"
// import ContactForm from "../components/newssign"
// import useNetlifyIdentity from '../components/useNetlifyIdentity';
import { TbRulerMeasure } from "react-icons/tb";

function YardStick() {
  const { language, showNav } = useSiteMetadata();
  const { dicName, dicEmail, dicMessage, dicSubmit, dicPhone } = language;

  


  return (


<Layout>
<Helmet>

  
        <body id="body" className="install" />
      </Helmet>

      {showNav ? (
        <div id="top" className="spacer" style={{ height: "0px", border: "0px solid yellow" }}></div>
      ) : (
        ""
      )}




<div className="flexbutt" style={{ padding: "2vh 2% 0 2%", width:'100%',maxWidth: "100vw", margin: "0 auto", display: "", flexDirection: "", justifyContent: "", alignItems:'', gap:'2vw', }}>

<div style={{ padding: "2vh 0", width:'100vw',maxWidth: "100vw", margin: "0 auto", display: "", flexDirection: "", justifyContent: "", alignItems:'', gap:'2vw', }}>
    <iframe title="location map" className="virtualtour flexcheek" width="100%" height="500" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://dogpoopers.com/map" allowFullScreen="true" loading="lazy" origin="https://dogpoopers.com" style={{maxWidth:'100%', minWidth:'100%', margin:'0 auto', border:'0px solid #333', borderRadius:'12px'}}></iframe>
    
    <div style={{ display: 'flex', justifyContent: 'center', position:'relative', alignItems:'center', padding:'1vh 1vw', textDecoration:'none', width:'80%', borderRadius:'0 0 12px 12px', margin:'0 auto 0 auto', textAlign:'center', fontSize:'clamp(1rem, 1vw, 1.8rem)', background: 'rgba(0,0,0,0.60)',  backdropFilter: 'blur(4px)', border:'1px solid #333', color:'#fff' }}>

    <div style={{transform:'rotate(-45deg)', position:'relative', top:'-5px', right:'5px', }}>Ruff!<br />|</div>
    
    <TbRulerMeasure style={{marginRight:'5px', fontSize:'50px'}} />
    <span style={{fontSize:'clamp(.8rem, 2vw, 1.8rem)'}}>YardStick™ - Yard Sizing Tool</span>
    </div>
</div>

    <div className="flexcheek" style={{width:'400px'}}>
    
    {/* <StaticImage src="../../static/assets/measure-tool.png" alt="Default Image" style={{height:'auto', maxHeight:'100vh', position:'relative', zIndex:'0', top:'0',border:'1px solid #222', borderRadius:'8px', objectFit:'contain', margin:'0 auto'}} /> */}

    <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center', padding:'1vh 1vw', textDecoration:'none', width:'80%', borderRadius:'12px', margin:'50px auto 0 auto', textAlign:'center', fontSize:'clamp(1rem, 1vw, 1.8rem)', background: 'rgba(0,0,0,0.60)',  backdropFilter: 'blur(4px)', border:'1px solid #333', color:'#fff' }}>
    <TbRulerMeasure style={{marginRight:'8px', fontSize:'50px'}} />Using Dog Poopers YardStick tool</div>



     <ul className="bullet panel" >
<li style={{fontSize:'clamp(1rem, 1vw, 1.8rem)', display:'flex', alignItems:'center', gap:'10px'}}><span style={{fontSize:'1.2rem'}}>💩</span> Locate your property on the map and zoom in to 100%</li>
<li style={{fontSize:'clamp(1rem, 1vw, 1.8rem)', display:'flex', alignItems:'center', gap:'10px'}}><span style={{fontSize:'1.2rem'}}>💩</span> Click the 'Size My Yard' button</li>
<li style={{fontSize:'clamp(1rem, 1vw, 1.8rem)', display:'flex', alignItems:'center', gap:'10px'}}><span style={{fontSize:'1.2rem'}}>💩</span> Click on the boundaries of your yard dropping points at each boundary</li>
<li style={{fontSize:'clamp(1rem, 1vw, 1.8rem)', display:'flex', alignItems:'center', gap:'10px'}}><span style={{fontSize:'1.2rem'}}>💩</span> Once you've connected the dots, it will show you the total footage of your yard</li>
</ul>
  
    </div>

  </div>











</Layout>




  );
}

export default YardStick;