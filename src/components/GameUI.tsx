import React from 'react';
import { User, GameState, Prison, Job, Item } from '../types';

interface GameUIProps {
  user: User;
  gameState: GameState | null;
  onUpdateGameState: (updates: Partial<GameState>) => Promise<void>;
  onLogout: () => void;
  config: { prisons: Prison[]; jobs: Job[]; items: Item[] };
  supportEmail: string;
}

const GameUI: React.FC<GameUIProps> = ({ user, gameState, onLogout, supportEmail }) => {
  if (!gameState) return <div className="text-green-400 font-mono">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono p-8">
      <h1 className="text-2xl text-green-400 mb-4">PrisonBlock v2.0</h1>
      <p className="mb-2">Welcome, {user.username} (ID: {user.prisonerId})</p>
      <p className="mb-4">Cash: ${gameState.cash} | Bank: ${gameState.bank}</p>
      <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2">Logout</button>
    </div>
  );
};

export default GameUI;
