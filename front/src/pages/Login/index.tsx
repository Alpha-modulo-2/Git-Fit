import "./styles.css";
import { Header } from "../../components/Header";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { FormEventHandler } from "react";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const Login = (props: Props) => {
  const { onSubmit } = props;
  return (
    <form onSubmit={onSubmit} action="http://localhost:3000/login">
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
            <input
              type="text"
              id="username"
              className="input-login"
              placeholder="E-mail"
            />
            <br />
            <input
              type="password"
              id="password"
              className="input-login"
              placeholder="Senha"
            />
            <br />
            <div className="divButton-edit">
              <button type="submit">Entrar</button>
              <br />
              <button className="registerOption">
                <Link to="/register">Não possuí conta?</Link>
              </button>
              <br />
              <label className="forgetPassEdit">Esqueci minha senha</label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
