
import React from 'react';
import { Leaf, User, MessageCircle, PlusCircle, Search } from 'lucide-react';

interface NavbarProps {
  onUploadClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onUploadClick, activeTab, setActiveTab }) => {
  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('browse')}>
            <Leaf className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              EcoSwap
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'browse' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}
            >
              Browse
            </button>
            <button 
              onClick={() => setActiveTab('matches')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'matches' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}
            >
              AI Matches
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}
            >
              My Profile
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onUploadClick}
              className="flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Swap Item</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 cursor-pointer">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
