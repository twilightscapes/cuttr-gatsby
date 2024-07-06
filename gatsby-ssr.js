// gatsby-ssr.js
import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="google-maps"
      src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC-iKnH_TwzkJytZvQiFNxdp_WQMlsJ4VQ&libraries=geometry,places,drawing&callback=initMap`}
      async
      defer
    />,
  ]);
};
