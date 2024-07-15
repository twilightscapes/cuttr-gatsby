import React, { useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import Seo from '../components/seo';
import Layout from '../components/siteLayout';
import { Helmet } from 'react-helmet';
import { StaticImage } from 'gatsby-plugin-image';

const OnBoard = () => {

  useEffect(() => {
    netlifyIdentity.init();

    const button1 = document.getElementById('left');
    const button2 = document.getElementById('right');

    const login = () => netlifyIdentity.open('login');
    const signup = () => netlifyIdentity.open('signup');

    button1.addEventListener('click', login);
    button2.addEventListener('click', signup);

    const updateUserInfo = (user) => {
      const container = document.querySelector('.user-info');

      const b1 = button1.cloneNode(true);
      const b2 = button2.cloneNode(true);

      container.innerHTML = '';

      if (user) {
        b1.innerText = 'Log Out';
        b1.addEventListener('click', () => {
          netlifyIdentity.logout();
        });

        b2.innerText = 'Manage Subscription';
        b2.addEventListener('click', () => {
          fetch('/.netlify/functions/create-manage-link', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${user.token.access_token}`,
            },
          })
            .then((res) => res.json())
            .then((link) => {
              window.location.href = link;
            })
            .catch((err) => console.error(err));
        });
      } else {
        b1.innerText = 'Log In';
        b1.addEventListener('click', login);

        b2.innerText = 'Sign Up';
        b2.addEventListener('click', signup);
      }

      container.appendChild(b1);
      container.appendChild(b2);
    };

    const loadSubscriptionContent = async (user) => {
      const token = user ? await netlifyIdentity.currentUser().jwt(true) : false;

      ['free', 'pro', 'premium'].forEach((type) => {
        fetch('/.netlify/functions/get-protected-content', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        })
          .then((res) => res.json())
          .then((data) => {
            const template = document.querySelector('#content');
            const container = document.querySelector(`.${type}`);

            const oldContent = container.querySelector('.content-display');
            if (oldContent) {
              container.removeChild(oldContent);
            }

            const content = template.content.cloneNode(true);

            const img = content.querySelector('img');
            img.src = data.src;
            img.alt = data.alt;

            const credit = content.querySelector('.credit');
            credit.href = data.creditLink;
            credit.innerText = `Credit: ${data.credit}`;

            const caption = content.querySelector('figcaption');
            caption.innerText = data.message;
            caption.appendChild(credit);

            container.appendChild(content);
          });
      });
    };

    const handleUserStateChange = (user) => {
      updateUserInfo(user);
      loadSubscriptionContent(user);
    };

    netlifyIdentity.on('init', handleUserStateChange);
    netlifyIdentity.on('login', handleUserStateChange);
    netlifyIdentity.on('logout', handleUserStateChange);

    return () => {
      netlifyIdentity.off('init', handleUserStateChange);
      netlifyIdentity.off('login', handleUserStateChange);
      netlifyIdentity.off('logout', handleUserStateChange);
    };
  }, []);

  return (
    <Layout className="thanks-page">
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
              <button id="left">Log In</button>
              <button id="right">Sign Up</button>
            </div>

            <div className="corgi-content">
              <div className="content">
                <h2>Free Content</h2>
                <div className="free"></div>
              </div>
              <div className="content">
                <h2>Pro Content</h2>
                <div className="pro"></div>
              </div>
              <div className="content">
                <h2>Premium Content</h2>
                <div className="premium"></div>
              </div>
            </div>

            <template id="content">
              <figure className="content-display">
                <img />
                <figcaption>
                  <a className="credit"></a>
                </figcaption>
              </figure>
            </template>

            <div className="spacer33" style={{ display: 'block', height: '' }} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OnBoard;
