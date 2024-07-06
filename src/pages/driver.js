import React from "react";
import Seo from "../components/seo";
import Layout from "../components/siteLayout";
import { Link } from "gatsby"
import { RiArrowLeftSLine, RiCheckboxCircleLine } from "react-icons/ri"
import { Helmet } from "react-helmet"

const Driver = () => {
      return (

 <Layout className="thanks-page">

<Helmet>

  
<body id="body" className="install homepage " />
</Helmet>

 <Seo title={`Thanks for being a Pooper!`} />


<section className="outer section section--gradient" >
      <div className="container" style={{padding: '30px 0', minHeight:'100dvh'}}>
        
      {/* <div className="mobile"><GoBack /></div> */}


    

<div style={{width:'90%', height:'100px', margin:'0 auto', textAlign:'center',}}>

{/* <p>
<strong>Hytron Manufacturing, Inc.</strong><br />
15582 Chemical Lane<br />
Huntington Beach, CA 92649<br />
</p> */}


<iframe src="https://app.mapline.com/map/map_6652cd95/cHljUGpubWZ2NG5OcmtHM3VVaWV2ajNmei9FMFNJd29saGtWcG" style={{width:'100%',height:'500px'}} allow="geolocation *"></iframe>



      <h1 className="" style={{fontSize:'50px',}}>Jeff North Gulfport Route</h1>
      <div className="spacer33"></div> 
      {/* <Link to="/" className="button">
        <RiArrowLeftSLine className="icon -left" />
        Back to Homepage
      </Link> */}


</div>






</div>



   


    </section>
    
    
    </Layout>
  );
};

export default Driver;