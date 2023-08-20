import { useState, createContext, ReactNode, useContext } from "react";
import { UserData } from "../interfaces/IUser";

  
  interface SearchedUsersContextType {
    usersFromSearch?: UserData[];
    setUsers:(users: UserData[]) => void;
    query: string;
    setQueryToSearch:(query: string) => void;
  }

  export const SearchedUsersContext = createContext<SearchedUsersContextType>({} as SearchedUsersContextType);
  
  interface SearchProviderProps{
    children: ReactNode;
  }

  export function SearchedUsersProvider({ children} : SearchProviderProps){
    const [usersFromSearch, setUsersFromSearch] = useState<UserData[]>();
    const [query, setQuery] = useState('');

    function setUsers(users: UserData[]){
        setUsersFromSearch(users)
    }

    function setQueryToSearch(query: string){
      setQuery(query);
    }
    
    return(
      <SearchedUsersContext.Provider value={  {usersFromSearch , setUsers, query, setQueryToSearch} }>
        {children}
      </SearchedUsersContext.Provider>
    )
  }

  // eslint-disable-next-line react-refresh/only-export-components
  export const useUsers = () => useContext(SearchedUsersContext)