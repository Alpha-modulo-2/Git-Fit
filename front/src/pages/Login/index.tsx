import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ILogin from "../../interfaces/ILogin";
import { User } from "../../interfaces/IUser";
import Form from "./formLogin";
import { useAuth } from "../../context/authContext";
import { Header } from "../../components/Header";
import { Modal } from "../../components/Modal";
import "./loginStyle.css";

export interface ApiResponseRequests {
  message?: string;
  user: User;
  token: string;
}

export const Login = () => {
  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const { isLoggedIn, login, setLoggedUser } = useAuth();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [messageModal, setMessageModal] = useState<string>("");

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/contacts");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userName = userNameValue;
    const password = passwordValue;
    const user: ILogin = { userName, password };

    const urlPath = import.meta.env.VITE_URL_PATH

    fetch(`${urlPath}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/profile");
          return response.json() as Promise<ApiResponseRequests>;
        } else {
          console.log("Failed to Login");
          setMessageModal("Dados incorretos");
          openModal();
        }
      })
      .then((data) => {
        if (data) {
          login(user);
          setCookie(data.token);
          setLoggedUser(data.user);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
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
    document.cookie = `${"session"}=${value};expires=${expires.toUTCString()};path=/`;
  }

  return (
    <div className="Login">
      <Header isLoggedIn={isLoggedIn} />
      <div className="All-content-login">
        <div className="container-login-content">
          <label className="loginTitle">Login</label>

          <Form
            onSubmit={handleSubmit}
            handleUserNameChange={handleUserNameChange}
            handlePasswordChange={handlePasswordChange}
          />
          <div className="divButton-edit">
            <label>
              Não possuí conta ainda?{" "}
              <span className="registerOption">Cadastre-se</span>
            </label>
          </div>
        </div>
      </div>
      {modalIsOpen && <Modal children={messageModal} onClick={closeModal} />}
    </div>
  );
};
