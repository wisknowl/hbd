import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT_THEME_COLORS, DARK_THEME_COLORS, ThemeColors, HBD_THEME } from '../theme';

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  typography: typeof HBD_THEME.typography;
  borderRadius: typeof HBD_THEME.borderRadius;
  shadows: typeof HBD_THEME.shadows;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: LIGHT_THEME_COLORS,
  toggleTheme: () => {},
  typography: HBD_THEME.typography,
  borderRadius: HBD_THEME.borderRadius,
  shadows: HBD_THEME.shadows,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(systemScheme === 'dark');

  const toggleTheme = () => setIsDark(prev => !prev);

  const value = useMemo(() => ({
    isDark,
    colors: isDark ? DARK_THEME_COLORS : LIGHT_THEME_COLORS,
    toggleTheme,
    typography: HBD_THEME.typography,
    borderRadius: HBD_THEME.borderRadius,
    shadows: HBD_THEME.shadows,
  }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
