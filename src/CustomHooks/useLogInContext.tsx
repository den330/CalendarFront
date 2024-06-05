import { LogInContext } from "../Contexts/LogInContextWrapper";
import { useContext } from "react";

export const useLogInContext = () => {
  const context = useContext(LogInContext);
  if (!context) {
    throw new Error(
      "useLogInContext must be used within a LogInContextWrapper"
    );
  }
  return context;
};
