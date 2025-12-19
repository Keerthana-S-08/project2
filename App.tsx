
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ItemCard from './components/ItemCard';
import SustainabilityStats from './components/SustainabilityStats';
import ItemUploadModal from './components/ItemUploadModal';
import { INITIAL_ITEMS, MOCK_USER } from './constants';
import { SwappableItem, UserProfile } from './types';
import { findBestMatches } from './services/geminiService';
// Fix: Added missing Heart and Leaf icons to the lucide-react imports
import { Search, Sparkles, Filter, RefreshCw, ChevronRight, Heart, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<SwappableItem[]>(INITIAL_ITEMS);
  const [userItems, setUserItems] = useState<SwappableItem[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'matches' | 'profile'>('browse');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const handleUpload = (newItem: Partial<SwappableItem>) => {
    const item: SwappableItem = {
      id: `item-${Date.now()}`,
      userId: MOCK_USER.id,
      userName: MOCK_USER.name,
      title: newItem.title || 'Untitled',
      description: newItem.description || '',
      category: newItem.category!,
      condition: newItem.condition!,
      imageUrl: newItem.imageUrl!,
      location: MOCK_USER.location,
      createdAt: Date.now(),
      tags: newItem.tags || []
    };
    setItems([item, ...items]);
    setUserItems([item, ...userItems]);
    setActiveTab('browse');
  };

  const runMatching = async () => {
    if (userItems.length === 0) {
      alert("Please list at least one item to see personalized matches!");
      return;
    }
    setIsMatching(true);
    const results = await findBestMatches(userItems, items.filter(i => i.userId !== MOCK_USER.id), MOCK_USER.wants);
    setMatches(results);
    setIsMatching(false);
  };

  useEffect(() => {
    if (activeTab === 'matches' && matches.length === 0) {
      runMatching();
    }
  }, [activeTab]);

  const filteredItems = items.filter(item => 
    item.userId !== MOCK_USER.id && 
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        onUploadClick={() => setIsUploadOpen(true)} 
        activeTab={activeTab} 
        setActiveTab={(t: any) => setActiveTab(t)} 
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Discover Swaps</h1>
                <p className="text-gray-500 mt-1">Sustainable choices for a better community</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search books, gadgets, home..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                  <Filter className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                     <Search className="w-10 h-10 text-gray-300" />
                   </div>
                   <h3 className="text-lg font-bold text-gray-800">No items found</h3>
                   <p className="text-gray-500">Try adjusting your search or check back later!</p>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-8">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                  AI Smart Matches <Sparkles className="w-6 h-6 text-emerald-500 ml-2 animate-pulse" />
                </h1>
                <p className="text-gray-500 mt-1">Using Gemini AI to find perfect swaps for your listings</p>
              </div>
              <button 
                onClick={runMatching}
                disabled={isMatching}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
                <span>Refresh Matches</span>
              </button>
            </header>

            {userItems.length === 0 ? (
               <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No items to match</h2>
                    <p className="text-gray-600 mb-8">Upload items from your home to let Gemini find potential swap partners for you!</p>
                    <button 
                      onClick={() => setIsUploadOpen(true)}
                      className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg"
                    >
                      Start Listing Items
                    </button>
                  </div>
               </div>
            ) : isMatching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl"></div>
                 ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.length > 0 ? matches.map((match, idx) => {
                  const matchedItem = items.find(i => i.id === match.itemId);
                  if (!matchedItem) return null;
                  return (
                    <ItemCard 
                      key={idx} 
                      item={matchedItem} 
                      matchScore={match.score} 
                      matchReason={match.reason}
                    />
                  );
                }) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-gray-500 italic">No perfect matches found yet. Try adding more "Wants" in your profile!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-32 h-32 rounded-3xl object-cover ring-4 ring-emerald-50" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-4xl font-black text-gray-900">{MOCK_USER.name}</h1>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full w-fit">PRO SWAPPER</span>
                </div>
                <p className="text-gray-500 flex items-center justify-center md:justify-start">
                  Seattle, WA • Reliability {MOCK_USER.reliabilityScore}/5.0
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-400">Looking for:</span>
                  {MOCK_USER.wants.map(want => (
                    <span key={want} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                      {want}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                  Edit Profile
                </button>
              </div>
            </header>

            <SustainabilityStats user={MOCK_USER} />

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Items For Swap</h2>
                <button 
                  onClick={() => setIsUploadOpen(true)}
                  className="text-emerald-600 font-bold text-sm flex items-center hover:underline"
                >
                  Add New <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userItems.length > 0 ? userItems.map(item => (
                  <ItemCard key={item.id} item={item} actionLabel="Manage Listing" />
                )) : (
                  <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-gray-100">
                    <p className="text-gray-400 italic">You haven't listed any items yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">EcoSwap</span>
          </div>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            Reducing waste and building communities through the power of peer-to-peer swapping.
            Join thousands of others in the circular economy movement.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-100 text-xs text-gray-400">
            © 2024 EcoSwap Platform. Powered by Gemini AI.
          </div>
        </div>
      </footer>

      <ItemUploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUpload={handleUpload}
      />
    </div>
  );
};

export default App;
