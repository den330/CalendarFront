import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { LogInContextWrapper } from "./Contexts/LogInContextWrapper.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <LogInContextWrapper>
        <App />
      </LogInContextWrapper>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
