import React, { Component } from 'react';
import {Provider} from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import store from './store';

import Navbar from './components/Navbar';
import GithubCodeContainer from './components/GithubCodeContainer';
import LandscapeContainer from './components/LandscapeContainer';

import './App.scss';

class App extends Component {
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