import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import ReactGA from 'react-ga4';

import store from './store';

import Navbar from './components/Navbar';
import GithubCodeContainer from './components/GithubCodeContainer';
import LandscapeContainer from './components/LandscapeContainer';

import './App.scss';

// TODO: Update tracking ID to your GA4 measurement ID (format: G-XXXXXXXXXX)
const GA_TRACKING_ID = 'G-TODO';

function App() {
  useEffect(() => {
    ReactGA.initialize(GA_TRACKING_ID);
    ReactGA.send('pageview');
  }, []);

  return (
    <CookiesProvider>
      <Provider store={store}>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
        <div className="App">
          <Navbar showAboutOptions={false} />
          <div id="main">
            <GithubCodeContainer />
            <LandscapeContainer />
          </div>
        </div>
      </Provider>
    </CookiesProvider>
  );
}

export default App;
