import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';


function Nav() {
  return (
    <div className="nav">
      

      <Link to="/voting">
        <button className="nav_votingButton">Voting Page</button>
      </Link>
      <Link to="/signin" className="nav_link">
        <button className="nav_button">Sign In</button>
      </Link>
      
      <Link to="/signup" className="nav_link">
        <button className="nav_button">Sign Up</button>
      </Link>
    </div>
  );
}

export default Nav;

