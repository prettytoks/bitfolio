//import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
  
type NavbarProps = {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  };
  
  const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {

  return (
    <>
            
        <nav className={`flex items-center justify-between p-4 navbar ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-sky-200'}`}>

            <Link to="/" className="text-xl font-bold">
                Bitfolio
            </Link>

            <Link to="/trending" className="text-xl font-bold">
                Trending
            </Link>
            
            <button className="p-2 rounded-md" onClick={toggleDarkMode}>
                {isDarkMode ? (
                <FontAwesomeIcon icon={faSun} className="text-yellow-500" />
                ) : (
                <FontAwesomeIcon icon={faMoon} className="text-white" />
                )}
            </button>

        </nav>


    </>
  );
};

export default Navbar;
