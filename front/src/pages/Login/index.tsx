import "./styles.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

export const Login = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="Login">
      
      <Header isLoggedIn={true} />
      <div className="logo-name-login">
        <p className="logo-name-git-login">Git</p>
        <p className="logo-name-fit-login">Fit</p>
      </div>
      <div className="All-content-login">
        <div className="container-login-content">
          <label className="loginTitle">Login</label>
          <br />
          <input type="text" className="input-login" placeholder="E-mail" />
          <br />
          <input type="password" className="input-login" placeholder="Senha" />
          <br />
          <div className="divButton-edit">
            <Button category="primary" label="Entrar" onClick={() => navigate("/")} />
            <br />
            <label>Não possuí conta ainda? <span className="registerOption">Cadastre-se</span></label>
            <br />
            <label className="forgetPassEdit">Esqueci minha senha</label>
          </div>
        </div>
      </div>
    </div>
  );
};
