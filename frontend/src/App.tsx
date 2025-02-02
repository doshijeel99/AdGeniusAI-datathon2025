import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import ContentGenerator from './pages/ContentGenerator';
import Reports from './pages/Reports';
import { motion } from 'framer-motion';
import ABTesting from './pages/ABTesting';
import MarketNews from './pages/MarketNews';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full overflow-y-auto"
          >
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/content" element={<ContentGenerator />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/ab-testing" element={<ABTesting />} />
              <Route path="/market-news" element={<MarketNews/>}/>
            </Routes>
          </motion.div>
        </div>
      </div>
    </Router>
  );
}

export default App;