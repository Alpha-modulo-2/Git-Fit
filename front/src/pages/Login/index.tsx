import "./styles.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import React, { useState } from "react";
import ILogin from "../../interfaces/ILogin";
import Form from "./formLogin";

export const Login = () => {
  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userName = userNameValue;
    const password = passwordValue;
    const user: ILogin = { userName, password };
    void fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( user ),
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        setIsLoggedIn(true);
        console.log(isLoggedIn);
      } else {
        alert("Login failed");
      }
    });
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameValue(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  if (isLoggedIn) {
    navigate("/profile");
  }

  return (
    <div className="Login">
      <Header isLoggedIn={isLoggedIn} />
      <div className="logo-name-login">
        <p className="logo-name-git-login">Git</p>
        <p className="logo-name-fit-login">Fit</p>
      </div>
      <div className="All-content-login">
        <div className="container-login-content">
        <label className="loginTitle">Login</label>

        <Form
            onSubmit={handleSubmit}
            handleUserNameChange={handleUserNameChange}
            handlePasswordChange={handlePasswordChange}
          />
          <div className="divButton-edit">
            <br />
            <label>
              Não possuí conta ainda?{" "}
              <span className="registerOption">Cadastre-se</span>
            </label>
            <br />
            <label className="forgetPassEdit">Esqueci minha senha</label>
          </div>
        </div>
      </div>
    </div>
  );
};
