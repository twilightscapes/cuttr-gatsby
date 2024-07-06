// gatsby-browser.js
export const onServiceWorkerUpdateReady = () => {
  // Check if window is defined before using it
  if (typeof window !== "undefined") {
    const answer = window.confirm(
      `This website has been updated since your last visit. ` +
      `Reload to display the latest version?`
    );

    if (answer === true) {
      window.location.reload();
    }
  }
};

// Ensure initMap is available globally
export const onClientEntry = () => {
  if (typeof window !== "undefined") {
    window.initMap = () => {
      // This function is required by the Google Maps API script
    };
  }
};
