import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';


function Nav() {
  return (
    <div className="nav">
      

      <Link to="/voting">
        <button className="nav_votingButton">Voting Page</button>
      </Link>
      <Link to="/sign-in" className="nav_link">Sign In</Link>
        <Link to="/sign-up" className="nav_link">Sign Up</Link>
    </div>
  );
}

export default Nav;

