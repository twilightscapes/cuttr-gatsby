import React, { useState } from "react";

import useSiteMetadata from "../hooks/SiteMetadata"




const SignUp = () => {
  const { language, proOptions } = useSiteMetadata();
  const { dicName, dicEmail, dicMessage, dicSubmit } = language;
  const { showContact } = proOptions;


  const [ setFileAttached] = useState(false);

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    const uploadText = document.getElementById("uploadText");
    if (files.length > 0) {
      setFileAttached(true);
      if (uploadText) {
        uploadText.textContent = "File Attached";
      }
    } else {
      setFileAttached(false);
      // if (uploadText) {
      //   uploadText.textContent = frontmatter.uploadtext;
      // }
    }
  };

  return (



      <div className="container panel" style={{ maxWidth: "1024px", margin: "0 auto", paddingTop: "" }}>



        {showContact ? (
          <div className="wrapper flexbutt" style={{ padding: "0 1% 10vh 1%", width: "100%", margin: "0 auto", display: "flex", flexDirection: "", justifyContent: "center" }}>

            
            <form
              className={`contact-form flexcheek1`}
              name="pirate"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              encType="multipart/form-data"
              action="/install3"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width:'100%',
                minWidth:'340px'
              }}
            >
              <input type="hidden" name="form-name" value="pirate" />
<span style={{fontSize:'70%'}}>Enter Your details:</span>
    
                <p>
                  <label htmlFor="name" aria-label="User Name">
                    <input type="text" id="name" name="name" placeholder={dicName} required />
                  </label>
                </p>
        

              <p>
                <label htmlFor="email" aria-label="Your Email">
                  <input id="email" type="email" name="email" placeholder={dicEmail} required />
                </label>
              </p>

      
                {/* <p>
                  <label htmlFor="phone" aria-label="Your Phone">
                    <input type="tel" id="phone" name="phone" placeholder={dicPhone} />
                  </label>
                </p> */}
    

              <p>
                <label htmlFor="message" aria-label="Your Message">
                  <textarea id="message" name="message" placeholder={dicMessage} required style={{maxHeight:'100px'}}></textarea>
                </label>
              </p>


            

              <label htmlFor="file" aria-label="Upload your file" style={{ padding: '0', color: 'inherit', textShadow: '1px 1px 0 #555', display: 'flex', flexDirection: 'column', width: '100%', fontSize: '90%', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
        
              <div style={{ padding: '0', color: 'inherit', textShadow: '1px 1px 0 #555', display: 'flex', flexDirection: 'column', width: '100px', height:'100px', border:'1px solid', fontSize: '90%', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>Upload Profile Photo</div>
            
      
                <input className="file-input hidden" type="file" id="file" name="file" onChange={handleFileInputChange} />
              </label>

              <p className="text-align-right1" style={{ margin: "0 auto", color: "#fff" }}>
                <button
                  className="button specialfont1"
                  type="submit"
                  style={{ width: '100%' }}
                >
                  {dicSubmit}
                </button>
              </p>
            </form>
          </div>
        ) : (
          "Please Upgrade to Plus"
        )}
      </div>

  );
};

export default SignUp;
