import { useState, createContext, ReactNode, useContext } from "react";
import { User } from "./types/interface";

  
  interface SearchedUsersContextType {
    usersFromSearch?: User[];
    setUsers:(users: User[]) => void;
  }

  export const SearchedUsersContext = createContext<SearchedUsersContextType>({} as SearchedUsersContextType);
  
  interface SearchProviderProps{
    children: ReactNode;
  }

  export function SearchedUsersProvider({ children} : SearchProviderProps){
    const [usersFromSearch, setUsersFromSearch] = useState<User[]>();

    function setUsers(users: User[]){
        setUsersFromSearch(users)
    }
    
    return(
      <SearchedUsersContext.Provider value={  {usersFromSearch , setUsers} }>
        {children}
      </SearchedUsersContext.Provider>
    )
  }

  // eslint-disable-next-line react-refresh/only-export-components
  export const useUsers = () => useContext(SearchedUsersContext)