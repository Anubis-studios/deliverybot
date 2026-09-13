import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import AuthScreen from './components/AuthScreen';
import GameUI from './components/GameUI';
import AdminDashboard from './components/AdminDashboard';
import { User, GameState, Prison, Job, Item } from './types';

// Supabase client initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Owner credentials
const OWNER_USERNAME = 'Warden Surge';
const OWNER_PASSWORD = 'Abc1234@';
const SUPPORT_EMAIL = 'epticwolf27@gmail.com';

// Configuration
const CONFIG = {
  prisons: [
    { id: 'nj', name: 'New Jersey', tier: 1, cost: 0 },
    { id: 'sq', name: 'San Quentin', tier: 2, cost: 5000 },
    { id: 'putnam', name: 'Putnam', tier: 2, cost: 7500 },
    { id: 'az', name: 'Arizona State', tier: 3, cost: 25000 },
    { id: 'sd', name: 'South Dakota', tier: 3, cost: 30000 },
    { id: 'la', name: 'Louisiana', tier: 3, cost: 35000 },
    { id: 'intl1', name: 'Black Site Alpha', tier: 4, cost: 100, currency: 'favors' },
    { id: 'intl2', name: 'Shadow Facility', tier: 5, cost: 250, currency: 'favors' }
  ] as Prison[],
  jobs: [
    { id: 'janitor', title: 'Janitor', wage: 50, reqDef: 0, reqStr: 0 },
    { id: 'laundry', title: 'Laundry Worker', wage: 120, reqDef: 20, reqStr: 10 },
    { id: 'kitchen', title: 'Kitchen Staff', wage: 300, reqDef: 50, reqStr: 30 },
    { id: 'mechanic', title: 'Mechanic', wage: 650, reqDef: 100, reqStr: 80 },
    { id: 'trustee', title: 'Trustee', wage: 800, reqDef: 150, reqStr: 100 }
  ] as Job[],
  items: [
    { id: 'shank', name: 'Rusty Shank', type: 'weapon', val: 5, cost: 200 },
    { id: 'pipe', name: 'Lead Pipe', type: 'weapon', val: 12, cost: 800 },
    { id: 'knife', name: 'Switchblade', type: 'weapon', val: 25, cost: 2500 },
    { id: 'vest', name: 'Makeshift Vest', type: 'armor', val: 8, cost: 300 },
    { id: 'jacket', name: 'Leather Jacket', type: 'armor', val: 20, cost: 1200 },
    { id: 'choc', name: 'Chocolate Bar', type: 'consumable', effect: 'energy', val: 30, cost: 50 },
    { id: 'water', name: 'Water Bottle', type: 'consumable', effect: 'stamina', val: 30, cost: 30 },
    { id: 'medkit', name: 'First Aid Kit', type: 'consumable', effect: 'hp', val: 50, cost: 150 }
  ] as Item[]
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
    setIsLoading(false);
  };

  const loadUserData = async (userId: string) => {
    try {
      // Check if user is admin/owner
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        const userData: User = {
          id: profile.id,
          prisonerId: profile.prisoner_id,
          username: profile.username,
          email: profile.email,
          isAdmin: profile.is_admin || false,
          isBanned: profile.is_banned || false,
          premiumTier: profile.premium_tier || 'free',
          createdAt: profile.created_at
        };

        setUser(userData);
        setIsAdmin(userData.isAdmin || userData.username === OWNER_USERNAME);

        // Load game state
        const { data: gameData } = await supabase
          .from('game_state')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (gameData) {
          setGameState(gameData as GameState);
        } else {
          // Create initial game state
          const initialGameState: GameState = {
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
            cellItems: []
          };

          const { data: newGameData } = await supabase
            .from('game_state')
            .insert({ user_id: userId, ...initialGameState })
            .select()
            .single();

          setGameState(newGameData as GameState);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogin = async (prisonerId: string, codeword: string) => {
    // Check for owner credentials
    if (prisonerId === OWNER_USERNAME && codeword === OWNER_PASSWORD) {
      const ownerUser: User = {
        id: 'owner',
        prisonerId: OWNER_USERNAME,
        username: OWNER_USERNAME,
        email: SUPPORT_EMAIL,
        isAdmin: true,
        isBanned: false,
        premiumTier: 'lifetime',
        createdAt: new Date().toISOString()
      };
      setUser(ownerUser);
      setIsAdmin(true);
      
      const ownerGameState: GameState = {
        level: 100,
        location: 'nj',
        cash: 999999,
        favors: 9999,
        bank: 9999999,
        stats: { str: 1000, def: 1000, spd: 1000 },
        vitals: { nrg: 100, maxNrg: 100, stm: 100, maxStm: 100, hp: 100, maxHp: 100 },
        job: 'trustee',
        equipment: { weapon: { id: 'god', name: 'Admin Blade', type: 'weapon', val: 1000, cost: 0 }, armor: { id: 'god', name: 'Admin Armor', type: 'armor', val: 1000, cost: 0 } },
        inventory: [],
        cellItems: []
      };
      setGameState(ownerGameState);
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${prisonerId}@prisonblock.com`,
        password: codeword
      });

      if (error) throw error;
      await loadUserData(data.user.id);
      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const handleRegister = async (username: string, codeword: string) => {
    const prisonerId = `PB-${Math.floor(Math.random() * 90000 + 10000)}`;
    const email = `${prisonerId}@prisonblock.com`;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: codeword,
        options: {
          data: {
            username,
            prisoner_id: prisonerId
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      // Create profile without email confirmation
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          prisoner_id: prisonerId,
          email,
          is_admin: false,
          is_banned: false,
          premium_tier: 'free'
        });

        // Create initial game state
        await supabase.from('game_state').insert({
          user_id: data.user.id,
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
          cellItems: []
        });
      }

      return { success: true, prisonerId };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setGameState(null);
    setIsAdmin(false);
  };

  const updateGameState = async (updates: Partial<GameState>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('game_state')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGameState(data as GameState);
    } catch (error) {
      console.error('Error updating game state:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-green-400 font-mono text-xl">Loading PrisonBlock v2.0...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        supportEmail={SUPPORT_EMAIL}
      />
    );
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="bg-black p-8 border-2 border-red-500 max-w-md">
          <h1 className="text-red-500 font-mono text-2xl mb-4">ACCOUNT BANNED</h1>
          <p className="text-gray-300 mb-4">Your account has been suspended by administration.</p>
          <p className="text-gray-400 text-sm">Contact: {SUPPORT_EMAIL}</p>
          <button 
            onClick={handleLogout}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-mono"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminDashboard 
        user={user}
        gameState={gameState}
        onLogout={handleLogout}
        supabaseAdmin={supabaseAdmin}
        supportEmail={SUPPORT_EMAIL}
      />
    );
  }

  return (
    <GameUI 
      user={user}
      gameState={gameState}
      onUpdateGameState={updateGameState}
      onLogout={handleLogout}
      config={CONFIG}
      supportEmail={SUPPORT_EMAIL}
    />
  );
};

export default App;
