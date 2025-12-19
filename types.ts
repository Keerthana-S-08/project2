
export enum ItemCategory {
  BOOK = 'Book',
  ELECTRONICS = 'Electronics',
  HOME_GARDEN = 'Home & Garden',
  FASHION = 'Fashion',
  TOYS = 'Toys',
  OTHER = 'Other'
}

export enum ItemCondition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  GOOD = 'Good',
  FAIR = 'Fair'
}

export interface SwappableItem {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  imageUrl: string;
  location: string;
  createdAt: number;
  tags: string[];
}

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  offeredItemId: string;
  requestedItemId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  reliabilityScore: number;
  itemsSwapped: number;
  co2Saved: number; // in kg
  wants: string[]; // keywords of what they are looking for
}

export interface AIMatchResult {
  matchScore: number;
  reason: string;
  suggestedSwapId: string;
}
