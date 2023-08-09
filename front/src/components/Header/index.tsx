// import './styles.css';
import { Link } from "react-router-dom";
import "./styles.css";

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import {  useUsers } from "../../contexts";
import { User } from "../../types/interface";

interface PropTypes {
  isLoggedIn: boolean;
}

export const Header = ({ isLoggedIn }: PropTypes) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  
  const logo = new URL("../../assets/images/logo.png", import.meta.url).href;

  const navigate = useNavigate();
  
  const {  setUsers } = useUsers();
    
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchQuery(newValue);
  };
  /***************    GET USERS FROM SEARCH    ********************/
  async function searchUsers(query: string){
    try {        
        const response = await fetch(`http://localhost:3000/users/search?name=${query}`);
        if (response.ok) {
            const data = await response.json() as User[];
            console.log(data, 'searchusers');
            
              setUsers(data);
              console.log('Redirecting to /searched_results');
              navigate('/searched_results');
            
            return
        } else {
           
              // setUsers([])
            
            setError('Erro ao fazer pesquisa.');
            console.error( error);

        }
    }catch (error) {
        setError('Erro ao fazer pesquisa');
        console.error(error);
    }
  }
        
  useEffect(() => {
      let searchTimer: NodeJS.Timeout | null = null;

      // Clear the previous timeout to start a new one
      if (searchTimer) {
          clearTimeout(searchTimer);
      }

      // Set a new timeout for the search after 5 seconds
      searchTimer = setTimeout(() => {
          if (searchQuery) {
              searchUsers(searchQuery).catch((error) => {
                  console.error('Erro ao obter as solicitações:', error);
              });
          }
      }, 3000); // 5000 milliseconds (5 seconds)

      return () => {
          // Clean up by clearing the timer if the component unmounts or the searchQuery changes
          if (searchTimer) {
              clearTimeout(searchTimer);
          }
      };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  

  return (
    <header className="header">
      <div>
        <Link to="/landing_page" className="logo-img">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      {!isLoggedIn && (
        <>
          <div className="header-menu">
            <nav className="header-menu-items">
              <Link to="/register" className="menu-items">
                Registrar
              </Link>
              <Link to="/login" className="menu-items">
                Entrar
              </Link>
            </nav>
            <p className="header-line" />
          </div>
        </>
      )}

      {isLoggedIn && (
        <>
          <div className="header-menu">
            <nav className="header-menu-items">
              <Link to="/fullcard/:id" className="menu-items">
                Cards
              </Link>
              <Link to="/contacts" className="menu-items">
                Contatos
              </Link>
              <Link to="/profile" className="menu-items">
                Perfil
              </Link>
              <div className="search-box">
                    <input type="text" className="search-text" placeholder="Pesquisar" value={searchQuery} onChange={handleInputChange}/>
              </div>
            </nav>
            <p className="header-line" />
          </div>
        </>
      )}
    </header>
  );
}; 
