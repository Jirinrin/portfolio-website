import React, { Component } from 'react';
import {Provider} from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import ReactGA from 'react-ga';

import store from './store';

import Navbar from './components/Navbar';
import GithubCodeContainer from './components/GithubCodeContainer';
import LandscapeContainer from './components/LandscapeContainer';

import './App.scss';

class App extends Component {
  componentDidMount() {
    ReactGA.initialize('UA-133506146-1', { anonymizeIp: true });
    ReactGA.set({ anonymizeIp: true });
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
      <CookiesProvider>
        <Provider store={store}>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
          <div className="App">
            {/* /// dat showaboutoptions kan via redux evt */}
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
}

export default App;