// import './styles.css';
import { Link } from "react-router-dom";
import "./styles.css";

interface PropTypes {
  isLoggedIn: boolean;
}

export const Header = ({ isLoggedIn }: PropTypes) => {
  const logo = new URL("../../assets/images/logo.png", import.meta.url).href;

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
            </nav>
            <p className="header-line" />
          </div>
        </>
      )}
    </header>
  );
}; 
