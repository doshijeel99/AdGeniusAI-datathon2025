import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FileText, BarChart2, Brain,Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

function Navbar() {
  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AdGenius AI
            </h1>
            <p className="text-sm text-gray-500">Marketing Intelligence</p>
          </div>
        </div>
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