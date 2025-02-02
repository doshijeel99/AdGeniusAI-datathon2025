import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FileText, BarChart2, Brain,Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

function Navbar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2"
        >
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-xl font-bold text-gray-800">AdGenius AI</h1>
        </motion.div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-purple-50'
            }`
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span>Strategic Planning</span>
        </NavLink>
        
        <NavLink
          to="/content"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-purple-50'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span>Content Generation</span>
        </NavLink>
        
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-purple-50'
            }`
          }
        >
          <BarChart2 className="w-5 h-5" />
          <span>Reports Analysis </span>
        </NavLink>

        <NavLink
          to="/ab-testing"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-purple-50'
            }`
          }
        >
          <Beaker className="w-5 h-5" />
          <span>A/B Testing</span>
        </NavLink>

      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Powered by AdGenius AI
        </div>
      </div>
    </div>
  );
}

export default Navbar;