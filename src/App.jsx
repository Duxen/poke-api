import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Pokemon from './components/Pokemon';

function App() {
  return (
    <Router>
      <nav style={{ backgroundColor: 'red', height:'40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <Link to="/" style={{ color: 'white', marginRight: '10px', fontSize: '18px' }}>Home</Link>
        <Link to="/pokemon" style={{ color: 'white', marginLeft: '10px', fontSize: '18px' }}>Pokemon</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon" element={<Pokemon />} />
      </Routes>
    </Router>
  );
}

export default App;

