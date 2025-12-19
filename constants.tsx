
import { ItemCategory, ItemCondition, SwappableItem, UserProfile } from './types';

export const MOCK_USER: UserProfile = {
  id: 'user-1',
  name: 'Alex Green',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  location: 'Seattle, WA',
  reliabilityScore: 4.9,
  itemsSwapped: 12,
  co2Saved: 45.5,
  wants: ['classic novels', 'kitchen gadgets', 'vintage toys']
};

export const INITIAL_ITEMS: SwappableItem[] = [
  {
    id: 'item-1',
    userId: 'user-2',
    userName: 'Sarah Jenkins',
    title: 'The Great Gatsby - Hardcover',
    description: 'Beautiful vintage edition, great condition. Read once.',
    category: ItemCategory.BOOK,
    condition: ItemCondition.GOOD,
    imageUrl: 'https://picsum.photos/seed/book1/400/300',
    location: 'Portland, OR',
    createdAt: Date.now() - 86400000,
    tags: ['classic', 'vintage', 'hardcover']
  },
  {
    id: 'item-2',
    userId: 'user-3',
    userName: 'Mike Ross',
    title: 'Mechanical Keyboard (RGB)',
    description: 'Blue switches, works perfectly. Swapping because I upgraded.',
    category: ItemCategory.ELECTRONICS,
    condition: ItemCondition.LIKE_NEW,
    imageUrl: 'https://picsum.photos/seed/kb1/400/300',
    location: 'Seattle, WA',
    createdAt: Date.now() - 172800000,
    tags: ['gaming', 'peripheral', 'mechanical']
  },
  {
    id: 'item-3',
    userId: 'user-4',
    userName: 'Elena Rodriguez',
    title: 'Outdoor Ceramic Planters',
    description: 'Set of 3 blue ceramic pots. Minor chips on the base.',
    category: ItemCategory.HOME_GARDEN,
    condition: ItemCondition.FAIR,
    imageUrl: 'https://picsum.photos/seed/garden1/400/300',
    location: 'San Francisco, CA',
    createdAt: Date.now() - 43200000,
    tags: ['garden', 'pots', 'outdoor']
  },
  {
    id: 'item-4',
    userId: 'user-5',
    userName: 'Dwayne Johnson',
    title: 'Cast Iron Skillet (12")',
    description: 'Pre-seasoned, very heavy duty. Lasts a lifetime.',
    category: ItemCategory.HOME_GARDEN,
    condition: ItemCondition.GOOD,
    imageUrl: 'https://picsum.photos/seed/kitchen1/400/300',
    location: 'Los Angeles, CA',
    createdAt: Date.now() - 500000,
    tags: ['kitchen', 'cooking', 'iron']
  }
];
