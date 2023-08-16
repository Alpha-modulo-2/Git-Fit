// import './styles.css';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";
import { useAuth } from '../../context/authContext';
import "./styles.css";

interface PropTypes {
  isLoggedIn: boolean;
}

export const Header = ({ isLoggedIn }: PropTypes) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const logo = new URL("../../assets/images/logo.png", import.meta.url).href;

  function logoutPage(){
    if(isLoggedIn){
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      logout();
      navigate('/login');
    }
  }

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
              <Link to="/fullcard/0" className="menu-items">
                Cards
              </Link>
              <Link to="/contacts" className="menu-items">
                Contatos
              </Link>
              <Link to="/profile" className="menu-items">
                Perfil
              </Link>
              <Link to="/searched_results" className="menu-items">
                Pesquisar
              </Link>
              <SignOut
                size={25}
                weight='bold'
                color="white"
                className="icon-logout"
                onClick={logoutPage}
              />
            </nav>
            <p className="header-line" />
          </div>
        </>
      )}
    </header>
  );
}; 
