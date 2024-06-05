import { ReactNode, createContext, useState } from "react";

type LogInContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
};

export const LogInContext = createContext<null | LogInContextType>(null);

export const LogInContextWrapper = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <LogInContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </LogInContext.Provider>
  );
};
