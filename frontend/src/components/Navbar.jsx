import React from 'react'
import navbarStyle from "../styles/Navbar.css";

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='navbar-logo'>App-Logo</div>
        <div className='navbar-menu'>
            <ul>Home</ul>
            <ul>Menu</ul>
            <ul>Contact Us</ul>
            <ul>About Us</ul>
        </div>

        
    </div>
  )
}

export default Navbar;