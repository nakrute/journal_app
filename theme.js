import { createContext, useContext, useMemo } from "react";
import { createThemedStyles } from "./styles";

const ThemeContext = createContext({
  isDarkMode: false,
  styles: createThemedStyles(false)
});

export function ThemeProvider({ children, isDarkMode }) {
  const value = useMemo(
    () => ({
      isDarkMode,
      styles: createThemedStyles(isDarkMode)
    }),
    [isDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useStyles() {
  return useContext(ThemeContext).styles;
}

export function useTheme() {
  return useContext(ThemeContext);
}
