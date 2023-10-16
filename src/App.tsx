import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Coins from './components/Coins';
import CoinDetails from './components/CoinDetails';
import Navbar from './components/Navbar';
import Trending from './components/Trending';

const App: React.FC = () => {

const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => {
  const storedDarkMode = JSON.parse(localStorage.getItem("darkMode") as string);
  if (storedDarkMode) {
    setIsDarkMode(true);
  }
}, []);

const toggleDarkMode = () => {
  setIsDarkMode((prevMode) => !prevMode);
};

useEffect(() => {
  localStorage.setItem("darkMode", JSON.stringify(isDarkMode) as string);

}, [isDarkMode]);


  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <Router>
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Coins isDarkMode={isDarkMode} />} />
          <Route path="/:id" element={<CoinDetails isDarkMode={isDarkMode} />} />
          <Route path="/trending" element={<Trending isDarkMode={isDarkMode} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
