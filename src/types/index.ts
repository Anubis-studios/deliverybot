export interface UserProfile {
  id: string;
  prisoner_id: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_banned: boolean;
  premium_tier: 'free' | 'monthly' | 'yearly' | 'lifetime';
  created_at: string;
}

export interface User {
  id: string;
  prisonerId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isBanned: boolean;
  premiumTier: 'free' | 'monthly' | 'yearly' | 'lifetime';
  createdAt: string;
}

export interface GameState {
  level: number;
  location: string;
  cash: number;
  favors: number;
  bank: number;
  stats: Stats;
  vitals: Vitals;
  job: string | null;
  equipment: Equipment;
  inventory: Item[];
  cellItems: string[];
}

export interface Stats {
  str: number;
  def: number;
  spd: number;
}

export interface Vitals {
  nrg: number;
  maxNrg: number;
  stm: number;
  maxStm: number;
  hp: number;
  maxHp: number;
}

export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'amenity';
  val: number;
  cost: number;
  effect?: string;
  stat?: string;
}

export interface Prison {
  id: string;
  name: string;
  tier: number;
  cost: number;
  currency?: 'cash' | 'favors';
  levelCap?: number;
}

export interface Job {
  id: string;
  title: string;
  wage: number;
  reqDef: number;
  reqStr: number;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'gain' | 'loss' | 'info' | 'sys' | 'combat';
  timestamp: Date;
}

export interface Opponent {
  name: string;
  str: number;
  def: number;
  cash: number;
  level: number;
  prison: string;
}

export interface Gang {
  id: string;
  name: string;
  tag: string;
  leader: string;
  members: string[];
  founded: Date;
}
