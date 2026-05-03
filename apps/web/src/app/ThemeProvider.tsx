'use client';

import React, {createContext, useContext, useState} from 'react';

import type {ThemeMode} from './ui-primitives-v2';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'professional',
  setMode: () => {}
});

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [mode, setMode] = useState<ThemeMode>('professional');

  return (
    <ThemeContext.Provider value={{mode, setMode}}>
      <div data-theme-root={mode} data-theme={mode}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
