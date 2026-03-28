export const ANALYTICS_DATA = {
  wasteReduced: 126,
  moneySaved: 12600,
  co2Reduced: 25.2,
  peopleFed: 380,

  weeklyWaste: [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 8 },
    { label: 'Thu', value: 15 },
    { label: 'Fri', value: 22 },
    { label: 'Sat', value: 10 },
    { label: 'Sun', value: 14 },
  ],

  mealTypeWaste: [
    { label: 'Breakfast', value: 35, color: '#FCCA46' },
    { label: 'Lunch', value: 52, color: '#FE7F2D' },
    { label: 'Dinner', value: 39, color: '#619B8A' },
  ],

  categoryData: [
    { label: 'Rice & Grains', value: 35, color: '#FCCA46' },
    { label: 'Vegetables', value: 25, color: '#A1C181' },
    { label: 'Dal & Curries', value: 20, color: '#FE7F2D' },
    { label: 'Bread & Roti', value: 12, color: '#619B8A' },
    { label: 'Other', value: 8, color: '#233D4D' },
  ],

  environmentalImpact: {
    treesSaved: 4.2,
    waterSaved: 3150, // liters
    carbonOffset: 25.2, // kg
  },

  staffHistorical: [
    { day: 'Mon', breakfast: 180, lunch: 220, dinner: 195 },
    { day: 'Tue', breakfast: 165, lunch: 230, dinner: 210 },
    { day: 'Wed', breakfast: 190, lunch: 215, dinner: 185 },
    { day: 'Thu', breakfast: 175, lunch: 225, dinner: 200 },
    { day: 'Fri', breakfast: 160, lunch: 240, dinner: 215 },
    { day: 'Sat', breakfast: 140, lunch: 200, dinner: 180 },
    { day: 'Sun', breakfast: 155, lunch: 210, dinner: 190 },
  ],

  ngoActivityFeed: [
    { id: 'nf1', ngoName: 'Food For All', action: 'Claimed 5kg Paneer Sabzi', time: '25 min ago', emoji: '🥘', verified: true },
    { id: 'nf2', ngoName: 'Annapurna Trust', action: 'Picked up 8 bread loaves', time: '1 hr ago', emoji: '🍞', verified: true },
    { id: 'nf3', ngoName: 'Care Foundation', action: 'Claimed Rice & Dal (5kg)', time: '2 hrs ago', emoji: '🍚', verified: false },
    { id: 'nf4', ngoName: 'Food For All', action: 'Claimed Fresh Fruits (10kg)', time: '3 hrs ago', emoji: '🍎', verified: true },
    { id: 'nf5', ngoName: 'Share Meals NGO', action: 'Picked up Chapati & Sabzi', time: '5 hrs ago', emoji: '🫓', verified: true },
  ],
};
