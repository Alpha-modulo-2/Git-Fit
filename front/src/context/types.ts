import ILogin from "../interfaces/ILogin";
import { User } from "../interfaces/IUser";

export interface AuthContextType {
    isLoggedIn: boolean;
    login: (user: ILogin) => void;
    logout: () => void;
    user?: User;
    setLoggedUser: (user: User) => void;
  }
  