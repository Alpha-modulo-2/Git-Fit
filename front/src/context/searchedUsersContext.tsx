import { useState, createContext, ReactNode, useContext } from "react";
import { User } from "../interfaces/IUser";

  
  interface SearchedUsersContextType {
    usersFromSearch?: User[];
    setUsers:(users: User[]) => void;
    query: string;
    setQueryToSearch:(query: string) => void;
  }

  export const SearchedUsersContext = createContext<SearchedUsersContextType>({} as SearchedUsersContextType);
  
  interface SearchProviderProps{
    children: ReactNode;
  }

  export function SearchedUsersProvider({ children} : SearchProviderProps){
    const [usersFromSearch, setUsersFromSearch] = useState<User[]>();
    const [query, setQuery] = useState('');

    function setUsers(users: User[]){
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