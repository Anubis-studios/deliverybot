# PrisonBlock v2.0 - Cell Block C

A browser-based, text-driven prison RPG/MMORPG built with React + Vite + Tailwind CSS.

## Features

- **Character Progression**: Train stats (Strength, Defense, Speed) in the gym
- **Jobs & Economy**: Work jobs to earn cash, manage bank accounts
- **PvP Combat**: Attack other inmates in the yard for loot
- **Black Market**: Buy weapons, armor, and consumables
- **Prison System**: Travel between multiple prisons with different tiers
- **Cell Customization**: Purchase amenities for your cell
- **Persistent State**: Save data via localStorage

## Owner Credentials

- **Username**: Warden Surge
- **Password**: Abc1234@
- **Support Email**: epticwolf27@gmail.com

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Game Mechanics

### Stats Training
- **Lift Weights**: Increases STR (-5 Energy, -2 Stamina)
- **Spar**: Increases DEF (-5 Energy, -2 Stamina)
- **Run Laps**: Increases SPD (-8 Energy, -5 Stamina)

### Jobs
Start as Janitor and work your way up to Trustee by training your stats.

### Combat
Attack inmates in the yard. Winners steal 60% of opponent's cash. Losers lose 10% of their cash.

### Banking
Deposit cash to protect it from being stolen during combat.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + localStorage
- **Backend Ready**: Supabase integration prepared

## File Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks (useGameEngine)
├── types/          # TypeScript type definitions
├── utils/          # Configuration and utilities
├── App.tsx         # Main application component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## License

All content © 2024 PrisonBlock. All rights reserved.
