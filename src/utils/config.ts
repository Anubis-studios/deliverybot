import { Prison, Job, Item } from '../types';

export const CONFIG = {
  prisons: [
    { id: 'nj', name: 'New Jersey', tier: 1, cost: 0, levelCap: 10 },
    { id: 'sq', name: 'San Quentin', tier: 2, cost: 5000, levelCap: 25 },
    { id: 'putnam', name: 'Putnam', tier: 2, cost: 7500, levelCap: 30 },
    { id: 'az', name: 'Arizona State', tier: 3, cost: 25000, levelCap: 50 },
    { id: 'sd', name: 'South Dakota', tier: 3, cost: 30000, levelCap: 60 },
    { id: 'la', name: 'Louisiana', tier: 3, cost: 35000, levelCap: 70 },
    { id: 'intl1', name: 'Black Site Alpha', tier: 4, cost: 100, currency: 'favors' as const, levelCap: 100 },
    { id: 'intl2', name: 'Shadow Penitentiary', tier: 5, cost: 250, currency: 'favors' as const, levelCap: 150 },
  ] as Prison[],

  jobs: [
    { id: 'janitor', title: 'Janitor', wage: 50, reqDef: 0, reqStr: 0 },
    { id: 'laundry', title: 'Laundry Worker', wage: 120, reqDef: 20, reqStr: 10 },
    { id: 'kitchen', title: 'Kitchen Staff', wage: 300, reqDef: 50, reqStr: 30 },
    { id: 'trustee', title: 'Trustee', wage: 800, reqDef: 150, reqStr: 100 },
    { id: 'librarian', title: 'Library Assistant', wage: 450, reqDef: 80, reqStr: 40 },
    { id: 'mechanic', title: 'Workshop Mechanic', wage: 650, reqDef: 120, reqStr: 90 },
  ] as Job[],

  items: [
    // Weapons
    { id: 'shank', name: 'Rusty Shank', type: 'weapon' as const, val: 5, cost: 200 },
    { id: 'pipe', name: 'Lead Pipe', type: 'weapon' as const, val: 12, cost: 800 },
    { id: 'knife', name: 'Switchblade', type: 'weapon' as const, val: 25, cost: 2500 },
    { id: 'club', name: 'Shiv Club', type: 'weapon' as const, val: 40, cost: 5000 },
    { id: 'chain', name: 'Bike Chain', type: 'weapon' as const, val: 60, cost: 10000 },
    
    // Armor
    { id: 'vest', name: 'Makeshift Vest', type: 'armor' as const, val: 8, cost: 300 },
    { id: 'jacket', name: 'Leather Jacket', type: 'armor' as const, val: 20, cost: 1200 },
    { id: 'pad', name: 'Kevlar Padding', type: 'armor' as const, val: 35, cost: 3500 },
    { id: 'plate', name: 'Metal Plate', type: 'armor' as const, val: 55, cost: 8000 },
    
    // Consumables
    { id: 'choc', name: 'Chocolate Bar', type: 'consumable' as const, effect: 'energy', val: 30, cost: 50 },
    { id: 'water', name: 'Water Bottle', type: 'consumable' as const, effect: 'stamina', val: 30, cost: 30 },
    { id: 'medkit', name: 'First Aid Kit', type: 'consumable' as const, effect: 'hp', val: 50, cost: 150 },
    { id: 'coffee', name: 'Instant Coffee', type: 'consumable' as const, effect: 'energy', val: 50, cost: 100 },
    { id: 'protein', name: 'Protein Shake', type: 'consumable' as const, effect: 'stamina', val: 50, cost: 120 },
    
    // Cell Amenities
    { id: 'chair', name: 'Wooden Chair', type: 'amenity' as const, val: 5, cost: 500 },
    { id: 'book', name: 'Self-Defense Book', type: 'amenity' as const, val: 10, cost: 1000 },
    { id: 'radio', name: 'Small Radio', type: 'amenity' as const, val: 15, cost: 2000 },
    { id: 'tv', name: 'TV Set', type: 'amenity' as const, val: 25, cost: 5000 },
  ] as Item[],

  premiumTiers: [
    { id: 'monthly', name: 'Monthly Premium', price: 9.99, duration: 30, benefits: ['50% faster regen', '10% cash bonus', 'Exclusive items'] },
    { id: 'yearly', name: 'Yearly Premium', price: 99.99, duration: 365, benefits: ['50% faster regen', '15% cash bonus', 'Exclusive items', 'Priority support'] },
    { id: 'lifetime', name: 'Lifetime Premium', price: 249.99, duration: -1, benefits: ['50% faster regen', '20% cash bonus', 'All exclusive items', 'VIP status'] },
  ],

  ownerCredentials: {
    username: 'Warden Surge',
    password: 'Abc1234@',
    email: 'epticwolf27@gmail.com',
  },
};
