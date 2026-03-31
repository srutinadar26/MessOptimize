import { MenuItem, LeaderboardEntry, MarketplaceItem, MealHeadcount } from './types';

export const SAMPLE_MENU: MenuItem[] = [
  // Monday (day 1)
  { id: 'm1', name: 'Masala Dosa', category: 'breakfast', description: 'Crispy rice crepe with spiced potato filling and chutneys', tags: ['veg', 'vegan'], spiceLevel: 1, upvotes: 45, downvotes: 3, imageEmoji: '🫓', day: 1, userVote: null },
  { id: 'm2', name: 'Sambar Rice', category: 'lunch', description: 'Lentil stew with rice, vegetables & tamarind', tags: ['veg', 'vegan'], spiceLevel: 2, upvotes: 38, downvotes: 7, imageEmoji: '🍛', day: 1, userVote: null },
  { id: 'm3', name: 'Chapati & Dal', category: 'dinner', description: 'Whole wheat flatbreads with yellow lentil curry', tags: ['veg', 'vegan'], spiceLevel: 1, upvotes: 52, downvotes: 4, imageEmoji: '🫔', day: 1, userVote: null },
  { id: 'm22', name: 'Cold Coffee', category: 'beverage', description: 'Chilled coffee with milk froth', tags: ['veg'], spiceLevel: 0, upvotes: 67, downvotes: 2, imageEmoji: '☕', day: 1, userVote: null },
  { id: 'ff1', name: 'Cheese Burger', category: 'fastfood', description: 'Juicy beef patty with melted cheese', tags: ['non-veg'], spiceLevel: 1, upvotes: 34, downvotes: 5, imageEmoji: '🍔', day: 1, userVote: null },
  
  // Tuesday (day 2)
  { id: 'm4', name: 'Idli & Vada', category: 'breakfast', description: 'Steamed rice cakes with crispy lentil donuts', tags: ['veg', 'gluten-free'], spiceLevel: 0, upvotes: 61, downvotes: 2, imageEmoji: '🍥', day: 2, userVote: null },
  { id: 'm5', name: 'Chole Bhature', category: 'lunch', description: 'Spiced chickpeas with deep-fried bread', tags: ['veg'], spiceLevel: 2, upvotes: 75, downvotes: 6, imageEmoji: '🥘', day: 2, userVote: null },
  { id: 'm6', name: 'Paneer Butter Masala', category: 'dinner', description: 'Cottage cheese in rich tomato-cream gravy', tags: ['veg'], spiceLevel: 1, upvotes: 89, downvotes: 3, imageEmoji: '🍲', day: 2, userVote: null },
  { id: 'm23', name: 'Gulab Jamun', category: 'dessert', description: 'Soft milk-solid dumplings in rose syrup', tags: ['veg'], spiceLevel: 0, upvotes: 103, downvotes: 1, imageEmoji: '🍮', day: 2, userVote: null },
  { id: 'b1', name: 'Fresh Lime Soda', category: 'beverage', description: 'Refreshing lime soda with mint', tags: ['veg'], spiceLevel: 0, upvotes: 45, downvotes: 2, imageEmoji: '🍋', day: 2, userVote: null },
  { id: 'ff2', name: 'French Fries', category: 'fastfood', description: 'Crispy golden fries with seasoning', tags: ['veg'], spiceLevel: 0, upvotes: 52, downvotes: 3, imageEmoji: '🍟', day: 2, userVote: null },
  
  // Wednesday (day 3)
  { id: 'm7', name: 'Poha & Jalebi', category: 'breakfast', description: 'Flattened rice with spices paired with sweet spirals', tags: ['veg'], spiceLevel: 0, upvotes: 34, downvotes: 8, imageEmoji: '🥣', day: 3, userVote: null },
  { id: 'm8', name: 'Dal Makhani & Naan', category: 'lunch', description: 'Slow-cooked black lentils with buttery naan bread', tags: ['veg'], spiceLevel: 1, upvotes: 66, downvotes: 4, imageEmoji: '🍞', day: 3, userVote: null },
  { id: 'm9', name: 'Mixed Veg Biryani', category: 'dinner', description: 'Fragrant basmati rice with seasonal vegetables', tags: ['veg', 'vegan'], spiceLevel: 2, upvotes: 91, downvotes: 5, imageEmoji: '🍚', day: 3, userVote: null },
  { id: 'f1', name: 'Vada Pav', category: 'fastfood', description: "Mumbai's iconic street burger with spiced potato fritter", tags: ['veg', 'vegan'], spiceLevel: 2, upvotes: 118, downvotes: 4, imageEmoji: '🍔', day: 3, userVote: null },
  { id: 'b2', name: 'Masala Chai', category: 'beverage', description: 'Traditional Indian spiced tea', tags: ['veg'], spiceLevel: 0, upvotes: 78, downvotes: 3, imageEmoji: '🍵', day: 3, userVote: null },
  { id: 'ff3', name: 'Chicken Nuggets', category: 'fastfood', description: 'Crispy chicken nuggets with dip', tags: ['non-veg'], spiceLevel: 0, upvotes: 44, downvotes: 6, imageEmoji: '🍗', day: 3, userVote: null },
  
  // Thursday (day 4)
  { id: 'm10', name: 'Upma & Coconut Chutney', category: 'breakfast', description: 'Semolina porridge with vegetables and coconut', tags: ['veg'], spiceLevel: 1, upvotes: 28, downvotes: 11, imageEmoji: '🥣', day: 4, userVote: null },
  { id: 'm11', name: 'Rajma Chawal', category: 'lunch', description: 'Kidney bean curry with steamed basmati rice', tags: ['veg', 'vegan'], spiceLevel: 2, upvotes: 82, downvotes: 3, imageEmoji: '🍛', day: 4, userVote: null },
  { id: 'm12', name: 'Aloo Paratha', category: 'dinner', description: 'Stuffed potato flatbread with butter and curd', tags: ['veg'], spiceLevel: 1, upvotes: 55, downvotes: 7, imageEmoji: '🫓', day: 4, userVote: null },
  { id: 'f2', name: 'Cheese Pizza', category: 'fastfood', description: 'Thin crust pizza with mozzarella cheese', tags: ['veg'], spiceLevel: 1, upvotes: 88, downvotes: 6, imageEmoji: '🍕', day: 4, userVote: null },
  { id: 'b3', name: 'Mango Lassi', category: 'beverage', description: 'Sweet yogurt drink with mango pulp', tags: ['veg'], spiceLevel: 0, upvotes: 85, downvotes: 2, imageEmoji: '🥭', day: 4, userVote: null },
  { id: 'ff4', name: 'Veg Burger', category: 'fastfood', description: 'Plant-based patty with fresh veggies', tags: ['veg'], spiceLevel: 1, upvotes: 62, downvotes: 4, imageEmoji: '🍔', day: 4, userVote: null },
  
  // Friday (day 5)
  { id: 'm13', name: 'Puri Bhaji', category: 'breakfast', description: 'Deep-fried wheat bread with spiced potato', tags: ['veg'], spiceLevel: 1, upvotes: 47, downvotes: 9, imageEmoji: '🫔', day: 5, userVote: null },
  { id: 'm14', name: 'Chicken Biryani', category: 'lunch', description: 'Aromatic rice with tender chicken pieces', tags: ['non-veg'], spiceLevel: 3, upvotes: 112, downvotes: 4, imageEmoji: '🍗', day: 5, userVote: null },
  { id: 'm15', name: 'Palak Paneer & Roti', category: 'dinner', description: 'Cottage cheese in creamy spinach gravy', tags: ['veg'], spiceLevel: 1, upvotes: 70, downvotes: 5, imageEmoji: '🥬', day: 5, userVote: null },
  { id: 'f3', name: 'Chicken Burger', category: 'fastfood', description: 'Grilled chicken burger with lettuce', tags: ['non-veg'], spiceLevel: 1, upvotes: 81, downvotes: 5, imageEmoji: '🍔', day: 5, userVote: null },
  { id: 'b4', name: 'Iced Tea', category: 'beverage', description: 'Refreshing lemon iced tea', tags: ['veg'], spiceLevel: 0, upvotes: 56, downvotes: 4, imageEmoji: '🧋', day: 5, userVote: null },
  { id: 'ff5', name: 'Nachos with Cheese', category: 'fastfood', description: 'Crispy nachos topped with cheese sauce', tags: ['veg'], spiceLevel: 1, upvotes: 59, downvotes: 7, imageEmoji: '🫓', day: 5, userVote: null },
  
  // Saturday (day 6)
  { id: 'm16', name: 'Bread & Omelette', category: 'breakfast', description: 'Toasted bread with fluffy egg omelette', tags: ['non-veg'], spiceLevel: 0, upvotes: 53, downvotes: 6, imageEmoji: '🍳', day: 6, userVote: null },
  { id: 'm17', name: 'Special Thali', category: 'lunch', description: 'Complete meal with 8 items – a weekly treat!', tags: ['veg'], spiceLevel: 1, upvotes: 134, downvotes: 2, imageEmoji: '🍱', day: 6, userVote: null },
  { id: 'm18', name: 'Maggi & Soup', category: 'dinner', description: 'Instant noodles with hot tomato soup', tags: ['veg'], spiceLevel: 1, upvotes: 98, downvotes: 8, imageEmoji: '🍜', day: 6, userVote: null },
  { id: 'ff6', name: 'Hot Dog', category: 'fastfood', description: 'Classic hot dog with toppings', tags: ['non-veg'], spiceLevel: 0, upvotes: 45, downvotes: 8, imageEmoji: '🌭', day: 6, userVote: null },
  { id: 'b5', name: 'Hot Chocolate', category: 'beverage', description: 'Rich creamy hot chocolate', tags: ['veg'], spiceLevel: 0, upvotes: 64, downvotes: 2, imageEmoji: '☕', day: 6, userVote: null },
  { id: 'ff7', name: 'Veg Pizza', category: 'fastfood', description: 'Fresh veg pizza with mushrooms and olives', tags: ['veg'], spiceLevel: 1, upvotes: 76, downvotes: 5, imageEmoji: '🍕', day: 6, userVote: null },
  
  // Sunday (day 0)
  { id: 'm19', name: 'Pancakes & Banana', category: 'breakfast', description: 'Fluffy pancakes with honey and fresh banana', tags: ['veg'], spiceLevel: 0, upvotes: 76, downvotes: 3, imageEmoji: '🥞', day: 0, userVote: null },
  { id: 'm20', name: 'Mutton Curry & Rice', category: 'lunch', description: 'Slow-cooked mutton in robust masala gravy', tags: ['non-veg'], spiceLevel: 3, upvotes: 125, downvotes: 7, imageEmoji: '🍖', day: 0, userVote: null },
  { id: 'm21', name: 'Pasta Arrabbiata', category: 'dinner', description: 'Penne in spiced tomato sauce with herbs', tags: ['veg', 'vegan'], spiceLevel: 2, upvotes: 88, downvotes: 10, imageEmoji: '🍝', day: 0, userVote: null },
  { id: 'ff8', name: 'Burger Combo', category: 'fastfood', description: 'Burger with fries and drink', tags: ['non-veg'], spiceLevel: 1, upvotes: 92, downvotes: 6, imageEmoji: '🍔', day: 0, userVote: null },
  { id: 'b6', name: 'Fresh Orange Juice', category: 'beverage', description: 'Freshly squeezed orange juice', tags: ['veg'], spiceLevel: 0, upvotes: 71, downvotes: 1, imageEmoji: '🍊', day: 0, userVote: null },
  { id: 'b7', name: 'Buttermilk', category: 'beverage', description: 'Traditional spiced buttermilk', tags: ['veg'], spiceLevel: 0, upvotes: 69, downvotes: 3, imageEmoji: '🥛', day: 0, userVote: null },
  { id: 'm24', name: 'Gulab Jamun', category: 'dessert', description: 'Soft milk-solid dumplings in rose syrup', tags: ['veg'], spiceLevel: 0, upvotes: 95, downvotes: 2, imageEmoji: '🍮', day: 0, userVote: null },
  { id: 'ff9', name: 'Chicken Wings', category: 'fastfood', description: 'Spicy chicken wings with dip', tags: ['non-veg'], spiceLevel: 2, upvotes: 68, downvotes: 9, imageEmoji: '🍗', day: 0, userVote: null },
];

export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'Priya Sharma', streak: 28, mealsMissedReduced: 84, points: 2340, badges: ['🔥', '🌟', '♻️'], isCurrentUser: false },
  { rank: 2, userId: 'u2', name: 'Arjun Mehta', streak: 21, mealsMissedReduced: 63, points: 1890, badges: ['🔥', '💚'], isCurrentUser: false },
  { rank: 3, userId: 'u3', name: 'Sneha Patel', streak: 19, mealsMissedReduced: 57, points: 1710, badges: ['🌟', '♻️'], isCurrentUser: false },
  { rank: 4, userId: 'current', name: 'You', streak: 14, mealsMissedReduced: 42, points: 1260, badges: ['🔥'], isCurrentUser: true },
  { rank: 5, userId: 'u4', name: 'Rohan Kumar', streak: 12, mealsMissedReduced: 36, points: 1080, badges: ['💚'], isCurrentUser: false },
  { rank: 6, userId: 'u5', name: 'Anjali Singh', streak: 10, mealsMissedReduced: 30, points: 900, badges: ['♻️'], isCurrentUser: false },
  { rank: 7, userId: 'u6', name: 'Dev Nair', streak: 9, mealsMissedReduced: 27, points: 810, badges: [], isCurrentUser: false },
  { rank: 8, userId: 'u7', name: 'Kavya Rao', streak: 7, mealsMissedReduced: 21, points: 630, badges: [], isCurrentUser: false },
  { rank: 9, userId: 'u8', name: 'Aditya Joshi', streak: 6, mealsMissedReduced: 18, points: 540, badges: [], isCurrentUser: false },
  { rank: 10, userId: 'u9', name: 'Pooja Verma', streak: 5, mealsMissedReduced: 15, points: 450, badges: [], isCurrentUser: false },
];

export const SAMPLE_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'mp1',
    name: 'Extra Paneer Sabzi',
    quantity: '3 kg (serves ~15)',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    postedBy: 'Mess Staff – Block A',
    messName: 'Tagore Hostel Mess',
    category: 'Main Course',
    ngoVerified: true,
    imageEmoji: '🥘',
    whatsappNumber: '+919876543210',
  },
  {
    id: 'mp2',
    name: 'Surplus Bread Loaves',
    quantity: '8 loaves',
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    postedBy: 'Mess Staff – Block B',
    messName: 'Nehru Hostel Mess',
    category: 'Bakery',
    ngoVerified: false,
    imageEmoji: '🍞',
    whatsappNumber: '+919876543211',
  },
  {
    id: 'mp3',
    name: 'Leftover Rice & Dal',
    quantity: '5 kg (serves ~25)',
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    postedBy: 'Mess Staff – Block C',
    messName: 'Gandhi Hostel Mess',
    category: 'Full Meal',
    ngoVerified: true,
    imageEmoji: '🍚',
    whatsappNumber: '+919876543212',
  },
  {
    id: 'mp4',
    name: 'Fresh Fruits Basket',
    quantity: '10 kg mixed fruits',
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    postedBy: 'Mess Staff – Block D',
    messName: 'Patel Hostel Mess',
    category: 'Fruits',
    ngoVerified: true,
    imageEmoji: '🍎',
    whatsappNumber: '+919876543213',
  },
  {
    id: 'mp5',
    name: 'Vada Pav (30 pcs)',
    quantity: '30 pieces',
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
    postedBy: 'Mess Staff – Block E',
    messName: 'Tagore Hostel Mess',
    category: 'Fast Food',
    ngoVerified: true,
    imageEmoji: '🍔',
    whatsappNumber: '+919876543214',
  },
  {
    id: 'mp6',
    name: 'Cold Coffee (2 liters)',
    quantity: '2 liters',
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    postedBy: 'Mess Staff – Block F',
    messName: 'Nehru Hostel Mess',
    category: 'Beverages',
    ngoVerified: false,
    imageEmoji: '☕',
    whatsappNumber: '+919876543215',
  },
];

export const SAMPLE_HEADCOUNT: MealHeadcount = {
  date: new Date().toISOString().split('T')[0],
  breakfast: 156,
  lunch: 203,
  dinner: 184,
  expectedBreakfast: 250,
  expectedLunch: 250,
  expectedDinner: 250,
};