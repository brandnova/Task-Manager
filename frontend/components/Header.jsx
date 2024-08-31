/* eslint-disable no-unused-vars */
// Header.js
import React, { useState } from 'react';
import { FaCode, FaBars, FaTimes,FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const [theme, setTheme] = useState('neon');
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const themeStyles = {
    neon: 'text-neon-blue',
    purple: 'text-purple-600',
  };

  return (
    <>
    
      </>
  );
};

export default Header;
