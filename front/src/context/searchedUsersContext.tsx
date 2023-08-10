import { useState, createContext, ReactNode, useContext } from "react";
import { UserData } from "../interfaces/IUser";

  
  interface SearchedUsersContextType {
    usersFromSearch?: UserData[];
    setUsers:(users: UserData[]) => void;
  }

  export const SearchedUsersContext = createContext<SearchedUsersContextType>({} as SearchedUsersContextType);
  
  interface SearchProviderProps{
    children: ReactNode;
  }

  export function SearchedUsersProvider({ children} : SearchProviderProps){
    const [usersFromSearch, setUsersFromSearch] = useState<UserData[]>();

    function setUsers(users: UserData[]){
        setUsersFromSearch(users)
        console.log(users, 'usersfromcontext')
    }
    
    return(
      <SearchedUsersContext.Provider value={  {usersFromSearch , setUsers} }>
        {children}
      </SearchedUsersContext.Provider>
    )
  }

  // eslint-disable-next-line react-refresh/only-export-components
  export const useUsers = () => useContext(SearchedUsersContext)