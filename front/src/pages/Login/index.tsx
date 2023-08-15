import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ILogin from '../../interfaces/ILogin';
import {User} from '../../interfaces/IUser';
import Form from './formLogin';
import { useAuth } from '../../context/authContext';
import { Header } from '../../components/Header';
import "./loginStyle.css";


export interface ApiResponseRequests {
  message?: string;
  user: User;
  token: string;
}

export const Login = () => {
  const [userNameValue, setUserNameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const { isLoggedIn, login, setLoggedUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/contacts');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userName = userNameValue;
    const password = passwordValue;
    const user: ILogin = { userName, password };

    fetch('https://localhost:443/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    .then((response) => {
        if (response.ok) {
          console.log(response, 'response')
          // navigate('/profile');
          
          return response.json() as Promise<ApiResponseRequests>;
        } else {
          alert('Login failed');
        }
      })
      .then(data =>{
        if(data){
          login(user);
          setCookie(data.token); 
          setLoggedUser(data.user)
        }
        console.log(data, 'data from login')
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameValue(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  function setCookie(value: string) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 3 * 24 * 60 * 60 * 1000);
    document.cookie = `${'session'}=${value};expires=${expires.toUTCString()};path=/`;
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
