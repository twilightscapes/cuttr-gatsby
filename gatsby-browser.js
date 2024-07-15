// gatsby-browser.js

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

export const wrapRootElement = ({ element }) => {

  const stripePromise = loadStripe('pk_live_51O3tWYKHJvXfkmw3F98KZ7I7367B5T8zSl7qIWhmDzP5o4XR4hRlCWdsAdiLDaLZ3Kfal2jTTitRIDC2azwyuwgl00T2NoCR5m');

  return (
    <Elements stripe={stripePromise}>
      {element}
    </Elements>
  );
};

export const onServiceWorkerUpdateReady = () => {
  // Check if window is defined before using it
  if (typeof window !== 'undefined') {
    const answer = window.confirm(
      `This website has been updated since your last visit. ` +
      `Reload to display the latest version?`
    );

    if (answer === true) {
      window.location.reload();
    }
  }
};
