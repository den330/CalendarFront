import { ReactNode, createContext, useState } from "react";

type LogInContextType = {
  isLoggedIn: { status: boolean; userId: string };
  setLoggedIn: (loggedIn: { status: boolean; userId: string }) => void;
};

export const LogInContext = createContext<null | LogInContextType>(null);

export const LogInContextWrapper = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState<{
    status: boolean;
    userId: string;
  }>({ status: false, userId: "" });
  return (
    <LogInContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </LogInContext.Provider>
  );
};
