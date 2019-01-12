import React, { Component } from 'react';
import store from './store';
import {Provider} from 'react-redux';

import Navbar from './components/Navbar';
import GithubCodeContainer from './components/GithubCodeContainer';
import LandscapeContainer from './components/LandscapeContainer';

import './App.scss';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
        {/* /// dat showaboutoptions kan via redux evt */}
          <Navbar showAboutOptions={false} />
          <div id="main">
            <GithubCodeContainer />
            <LandscapeContainer />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;