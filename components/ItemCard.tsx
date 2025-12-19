
import React from 'react';
import { SwappableItem } from '../types';
import { MapPin, Tag, Clock, User } from 'lucide-react';

interface ItemCardProps {
  item: SwappableItem;
  onAction?: (item: SwappableItem) => void;
  actionLabel?: string;
  matchScore?: number;
  matchReason?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAction, actionLabel = "Request Swap", matchScore, matchReason }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
           <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-emerald-700 border border-emerald-100 shadow-sm">
            {item.category}
          </span>
          <span className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-sm">
            {item.condition}
          </span>
        </div>
        {matchScore && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600 to-transparent p-3">
             <div className="flex items-center text-white">
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold mr-2">
                  {matchScore}%
                </div>
                <span className="text-xs font-medium italic">AI Match: {matchReason?.slice(0, 40)}...</span>
             </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
          <User className="w-3 h-3" />
          <span>{item.userName}</span>
        </div>
        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2">{item.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center">
              <Tag className="w-2 h-2 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex items-center text-xs text-gray-400">
            <MapPin className="w-3 h-3 mr-1" />
            {item.location}
          </div>
          <button 
            onClick={() => onAction?.(item)}
            className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
