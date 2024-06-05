import { ReactNode, createContext, useState } from "react";

type LogInContextType = {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
};

export const LogInContext = createContext<null | LogInContextType>(null);

export const LogInContextWrapper = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <LogInContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LogInContext.Provider>
  );
};
