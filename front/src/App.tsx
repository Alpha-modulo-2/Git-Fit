import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import { Router } from "./routes";
import { AuthProvider } from "./context/authContext";

export const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </AuthProvider>
);
