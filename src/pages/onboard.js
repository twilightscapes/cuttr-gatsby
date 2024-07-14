import React, { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import Seo from '../components/seo';
import Layout from '../components/siteLayout';
import { Helmet } from 'react-helmet';
import { StaticImage } from 'gatsby-plugin-image';

const OnBoard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    netlifyIdentity.init();

    const handleUserStateChange = (user) => {
      setUser(user);
      if (user) {
        loadSubscriptionContent(user);
      }
    };

    netlifyIdentity.on('login', handleUserStateChange);
    netlifyIdentity.on('logout', handleUserStateChange);
    netlifyIdentity.on('init', handleUserStateChange);

    return () => {
      netlifyIdentity.off('login', handleUserStateChange);
      netlifyIdentity.off('logout', handleUserStateChange);
      netlifyIdentity.off('init', handleUserStateChange);
    };
  }, []);

  const login = () => {
    netlifyIdentity.open('login');
  };

  const signup = () => {
    netlifyIdentity.open('signup');
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const loadSubscriptionContent = (user) => {
    ['free', 'pro', 'premium'].forEach((type) => {
      fetch('/.netlify/functions/get-protected-content', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token.access_token}`,
        },
        body: JSON.stringify({ type }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle content update using React state
          updateContent(type, data);
        })
        .catch((err) => console.error(err));
    });
  };

  const updateContent = (type, data) => {
    // Update state to trigger re-render with new content
    setContents((prevContents) => ({
      ...prevContents,
      [type]: data,
    }));
  };

  const renderContent = (type) => {
    const content = contents[type];
    if (!content) return null;

    return (
      <div className={`${type}`}>
        <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Content</h3>
        <img src={content.src} alt={content.alt} />
        <p>{content.message}</p>
        <a href={content.creditLink}>Credit: {content.credit}</a>
      </div>
    );
  };

  const [contents, setContents] = useState({
    free: null,
    pro: null,
    premium: null,
  });

  return (
    <>
      <Helmet>
        <body id="body" className="homepage1" />
      </Helmet>

      <Seo title={`Dog Poopers`} />

      <section className="outer section section--gradient">
        <div className="container" style={{ padding: '0 0', minHeight: '' }}>
          <div style={{ width: '100%', height: '', margin: '0 auto', textAlign: 'center', background: 'hsl(147, 61%, 26%)' }}>
            <StaticImage
              src="../../static/assets/dogpoopers-header-single.webp"
              alt="Default Image"
              style={{ height: 'auto', maxHeight: '100vh', position: 'relative', zIndex: '0', top: '0', border: '0px solid !important', objectFit: 'cover', margin: '0 auto 2vh auto' }}
            />

            <h1>Sign Up for Premium Corgi Content</h1>

            <div className="user-info">
              {user ? (
                <>
                  <button id="left" onClick={logout}>Log Out</button>
                  {/* <button id="right" onClick={manageSubscription}>Manage Subscription</button> */}
                  
                </>
              ) : (
                <>
                  <button id="left" onClick={login}>Log In</button>
                  <button id="right" onClick={signup}>Sign Up</button>
                </>
              )}
            </div>

            <div className="corgi-content">
              <div className="content">
                {renderContent('free')}
              </div>
              <div className="content">
                {renderContent('pro')}
              </div>
              <div className="content">
                {renderContent('premium')}
              </div>
            </div>

            <div className="spacer33" style={{ display: 'block', height: '' }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default OnBoard;
