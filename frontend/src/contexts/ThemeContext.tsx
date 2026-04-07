import { createContext, ReactNode, useContext } from "react";

const theme = {
  name: "agro"
};

const ThemeContext = createContext(theme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
