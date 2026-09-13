import { useState, useEffect, useCallback } from 'react';
import { User, Stats, Vitals, Equipment, LogEntry, Opponent } from '../types';
import { CONFIG } from '../utils/config';

const STORAGE_KEY = 'prisonblock_save_v2';

export function useGameEngine() {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  // Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        addLog('Welcome back, Inmate.', 'sys');
      } catch (e) {
        console.error('Save file corrupted');
      }
    }
  }, []);

  // Save user to localStorage
  const saveUser = useCallback((userData: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Add log entry
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setLogs(prev => [entry, ...prev].slice(0, 100));
  }, []);

  // Create new user
  const createUser = useCallback((prisonerId: string, codeword: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      prisonerId,
      codeword,
      level: 1,
      location: 'nj',
      cash: 100,
      favors: 0,
      bank: 0,
      stats: { str: 10, def: 10, spd: 10 },
      vitals: { nrg: 100, maxNrg: 100, stm: 100, maxStm: 100, hp: 100, maxHp: 100 },
      job: null,
      equipment: { weapon: null, armor: null },
      inventory: [],
      cellItems: [],
      isBanned: false,
      isPremium: false,
      role: 'inmate',
      createdAt: new Date(),
      lastActive: new Date(),
    };
    saveUser(newUser);
    addLog(`Registration complete. Your ID: ${prisonerId}`, 'sys');
    return newUser;
  }, [saveUser, addLog]);

  // Train stats
  const train = useCallback((stat: keyof Stats, energyCost: number, staminaCost: number) => {
    if (!user) return false;
    
    if (user.vitals.nrg >= energyCost && user.vitals.stm >= staminaCost) {
      const updated = { ...user };
      updated.vitals.nrg -= energyCost;
      updated.vitals.stm -= staminaCost;
      
      const gain = Math.max(0.1, 1.5 - (updated.stats[stat] / 200));
      updated.stats[stat] += gain;
      
      saveUser(updated);
      addLog(`Trained ${stat.toUpperCase()}. Gained ${gain.toFixed(2)}.`, 'gain');
      return true;
    } else {
      addLog('Insufficient Energy or Stamina!', 'loss');
      return false;
    }
  }, [user, saveUser, addLog]);

  // Work shift
  const work = useCallback(() => {
    if (!user || !user.job) {
      addLog('You are unemployed.', 'loss');
      return false;
    }
    
    const job = CONFIG.jobs.find(j => j.id === user.job);
    if (!job) return false;
    
    if (user.vitals.stm >= 20) {
      const updated = { ...user };
      updated.vitals.stm -= 20;
      updated.cash += job.wage;
      
      saveUser(updated);
      addLog(`Worked shift at ${job.title}. Earned $${job.wage}.`, 'gain');
      return true;
    } else {
      addLog('Too exhausted to work.', 'loss');
      return false;
    }
  }, [user, saveUser, addLog]);

  // Buy item
  const buyItem = useCallback((itemId: string) => {
    if (!user) return false;
    
    const item = CONFIG.items.find(i => i.id === itemId);
    if (!item || user.cash < item.cost) {
      addLog('Not enough cash!', 'loss');
      return false;
    }
    
    const updated = { ...user };
    updated.cash -= item.cost;
    
    if (item.type === 'consumable') {
      if (item.effect === 'energy') {
        updated.vitals.nrg = Math.min(updated.vitals.maxNrg, updated.vitals.nrg + item.val);
      } else if (item.effect === 'stamina') {
        updated.vitals.stm = Math.min(updated.vitals.maxStm, updated.vitals.stm + item.val);
      } else if (item.effect === 'hp') {
        updated.vitals.hp = Math.min(updated.vitals.maxHp, updated.vitals.hp + item.val);
      }
      addLog(`Used ${item.name}.`, 'info');
    } else if (item.type === 'weapon' || item.type === 'armor') {
      updated.equipment[item.type] = item;
      addLog(`Bought and equipped ${item.name}.`, 'gain');
    } else if (item.type === 'amenity') {
      updated.cellItems.push(itemId);
      addLog(`Purchased ${item.name} for your cell.`, 'gain');
    }
    
    saveUser(updated);
    return true;
  }, [user, saveUser, addLog]);

  // Attack opponent
  const attack = useCallback((opponent: Opponent) => {
    if (!user) return null;
    
    if (user.vitals.hp < 20) {
      addLog('You are too injured to fight!', 'loss');
      return null;
    }
    
    const userPow = (user.stats.str + (user.equipment.weapon?.val || 0)) * (1 + Math.random() * 0.2);
    const oppPow = opponent.str * (1 + Math.random() * 0.2);
    
    let result;
    if (userPow > oppPow) {
      const loot = Math.floor(opponent.cash * 0.6);
      const damage = Math.max(5, 20 - user.stats.def);
      
      const updated = { ...user };
      updated.cash += loot;
      updated.vitals.hp -= damage;
      
      saveUser(updated);
      result = { won: true, loot, damage };
      addLog(`DEFEATED ${opponent.name}! Looted $${loot}. Took ${damage} damage.`, 'combat');
    } else {
      const lost = Math.floor(user.cash * 0.1);
      const damage = Math.max(10, 30 - user.stats.def);
      
      const updated = { ...user };
      updated.cash = Math.max(0, updated.cash - lost);
      updated.vitals.hp -= damage;
      
      saveUser(updated);
      result = { won: false, lost, damage };
      addLog(`BEATEN by ${opponent.name}. Lost $${lost}. Took ${damage} damage.`, 'combat');
    }
    
    return result;
  }, [user, saveUser, addLog]);

  // Travel to prison
  const travel = useCallback((prisonId: string) => {
    if (!user) return false;
    
    const dest = CONFIG.prisons.find(p => p.id === prisonId);
    if (!dest || dest.id === user.location) return false;
    
    const currency = dest.currency || 'cash';
    const cost = dest.cost;
    
    if (user[currency] >= cost) {
      const updated = { ...user };
      updated[currency] -= cost;
      updated.location = prisonId;
      
      saveUser(updated);
      addLog(`Transferred to ${dest.name}.`, 'info');
      return true;
    } else {
      addLog(`Insufficient funds for transfer. Need ${cost} ${currency}.`, 'loss');
      return false;
    }
  }, [user, saveUser, addLog]);

  // Bank operations
  const bankOperation = useCallback((action: 'deposit' | 'withdraw', amount: number) => {
    if (!user || amount <= 0) return false;
    
    const updated = { ...user };
    
    if (action === 'deposit') {
      if (updated.cash >= amount) {
        updated.cash -= amount;
        updated.bank += amount;
        addLog(`Deposited $${amount}.`, 'info');
      } else {
        addLog('Not enough cash on hand.', 'loss');
        return false;
      }
    } else {
      if (updated.bank >= amount) {
        updated.bank -= amount;
        updated.cash += amount;
        addLog(`Withdrew $${amount}.`, 'info');
      } else {
        addLog('Insufficient bank balance.', 'loss');
        return false;
      }
    }
    
    saveUser(updated);
    return true;
  }, [user, saveUser, addLog]);

  // Passive regeneration tick
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const regenRate = user.isPremium ? 1.5 : 1.0;
      const updated = { ...user };
      
      if (updated.vitals.nrg < updated.vitals.maxNrg) {
        updated.vitals.nrg = Math.min(updated.vitals.maxNrg, updated.vitals.nrg + (1 * regenRate));
      }
      if (updated.vitals.stm < updated.vitals.maxStm) {
        updated.vitals.stm = Math.min(updated.vitals.maxStm, updated.vitals.stm + (1 * regenRate));
      }
      if (updated.vitals.hp < updated.vitals.maxHp) {
        updated.vitals.hp = Math.min(updated.vitals.maxHp, updated.vitals.hp + (0.5 * regenRate));
      }
      
      updated.lastActive = new Date();
      saveUser(updated);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [user, saveUser]);

  // Simulate online players
  useEffect(() => {
    const updateOnline = () => {
      setOnlineCount(Math.floor(Math.random() * 20) + 5);
    };
    updateOnline();
    const interval = setInterval(updateOnline, 30000);
    return () => clearInterval(interval);
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setLogs([]);
  }, []);

  return {
    user,
    logs,
    onlineCount,
    createUser,
    saveUser,
    addLog,
    train,
    work,
    buyItem,
    attack,
    travel,
    bankOperation,
    logout,
  };
}
