import React, { Component } from 'react';
import './Navbar.scss';

class Navbar extends Component {
  state = {  };
  render() { 
    return ( <nav>
      <li>ABOUT</li>
      <li>CONTACT</li>
      <li id="center-name">JIRI</li>
      <li>PROJECTS</li>
      <li>AWARDS</li>
    </nav> );
  }
}
 
export default Navbar;