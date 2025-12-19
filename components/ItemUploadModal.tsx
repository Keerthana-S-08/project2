
import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Loader2, Wand2 } from 'lucide-react';
import { analyzeItemImage } from '../services/geminiService';
import { ItemCategory, ItemCondition, SwappableItem } from '../types';

interface ItemUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (item: Partial<SwappableItem>) => void;
}

const ItemUploadModal: React.FC<ItemUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [itemData, setItemData] = useState<Partial<SwappableItem>>({
    title: '',
    description: '',
    category: ItemCategory.OTHER,
    condition: ItemCondition.GOOD,
    tags: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        autoAnalyze(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const autoAnalyze = async (base64: string) => {
    setIsAnalyzing(true);
    const base64Data = base64.split(',')[1];
    const result = await analyzeItemImage(base64Data);
    if (result) {
      setItemData({
        ...itemData,
        title: result.title,
        description: result.description,
        category: result.category as ItemCategory,
        condition: result.condition as ItemCondition,
        tags: result.tags
      });
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({ ...itemData, imageUrl: preview || 'https://picsum.photos/seed/placeholder/400/300' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">List an Item</h2>
            <p className="text-sm text-gray-500">Share your unused items with the community</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all ${preview ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              {preview ? (
                <div className="relative w-full h-48">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium">Change Image</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <Camera className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-gray-600 font-medium">Click or drag photo here</p>
                  <p className="text-xs text-gray-400 mt-1">AI will help you fill the details!</p>
                </>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-2" />
                  <p className="text-emerald-700 font-bold animate-pulse">AI is identifying your item...</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Item Title</label>
                  <input 
                    type="text" 
                    value={itemData.title}
                    onChange={(e) => setItemData({...itemData, title: e.target.value})}
                    placeholder="e.g. Vintage Camera, 19th Century Edition"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select 
                      value={itemData.category}
                      onChange={(e) => setItemData({...itemData, category: e.target.value as ItemCategory})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      {Object.values(ItemCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Condition</label>
                    <select 
                      value={itemData.condition}
                      onChange={(e) => setItemData({...itemData, condition: e.target.value as ItemCondition})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      {Object.values(ItemCondition).map(cond => <option key={cond} value={cond}>{cond}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea 
                    value={itemData.description}
                    onChange={(e) => setItemData({...itemData, description: e.target.value})}
                    rows={4}
                    placeholder="Tell others why this item is great and what you'd like in return..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">AI Generated Tags</label>
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {itemData.tags?.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center">
                        {tag}
                      </span>
                    ))}
                    {!itemData.tags?.length && <span className="text-gray-300 italic text-xs">Waiting for AI or manual input...</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!itemData.title || isAnalyzing}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                Confirm Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemUploadModal;
