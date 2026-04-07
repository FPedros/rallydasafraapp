import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  currentUserEmail: string | null;
  login: (payload: LoginPayload) => boolean;
  logout: () => void;
}

const AUTH_KEY = "rally:authenticated";
const AUTH_EMAIL_KEY = "rally:user-email";
const TEST_EMAIL = "teste@agroconsult.com.br";
const TEST_PASSWORD = "agro2026";

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem(AUTH_KEY) === "true"
  );
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() =>
    localStorage.getItem(AUTH_EMAIL_KEY)
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      currentUserEmail,
      login: ({ email, password }) => {
        const isValid =
          email.trim().toLowerCase() === TEST_EMAIL && password === TEST_PASSWORD;

        setIsAuthenticated(isValid);

        if (isValid) {
          setCurrentUserEmail(TEST_EMAIL);
          localStorage.setItem(AUTH_KEY, "true");
          localStorage.setItem(AUTH_EMAIL_KEY, TEST_EMAIL);
        } else {
          setCurrentUserEmail(null);
          localStorage.removeItem(AUTH_KEY);
          localStorage.removeItem(AUTH_EMAIL_KEY);
        }

        return isValid;
      },
      logout: () => {
        setIsAuthenticated(false);
        setCurrentUserEmail(null);
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(AUTH_EMAIL_KEY);
      }
    }),
    [currentUserEmail, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
