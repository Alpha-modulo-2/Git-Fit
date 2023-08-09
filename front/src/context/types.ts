import ILogin from "../interfaces/ILogin";

export interface AuthContextType {
    isLoggedIn: boolean;
    login: (user: ILogin) => void;
    logout: () => void;
  }
  