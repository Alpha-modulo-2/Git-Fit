import React, { useEffect, useState } from "react";
import "./styles.css";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { useParams } from "react-router-dom";

export const PerfilEdit = () => {
  const params = useParams();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    occupation: "",
    password: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    passwordCheck: "",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`https://localhost/users/${params.id}`);
        if (!response.ok) {
          console.error("Erro ao obter os dados do usuário.");
          return;
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao obter os dados do usuário:", error);
      }
    }

    fetchUserData();
  }, [params.id]);

  return (
    <div className="Edit">
      <Header isLoggedIn={true} />
      <div className="All-content-edit">
        <div className="container-edit-content">
          <div className="menu-edit">
            <div className="container-first-content-edit">
              <form encType="multipart/form-data" method="POST" action="/upload">
                <label htmlFor="photo-upload" className="custom-file-label-edit"></label>
                <input
                  id="photo-upload"
                  className="custom-file-input-edit"
                  type="file"
                  name="photo"
                  accept="image/*"
                />
                <input type="submit" className="addPhoto-edit" value="Adicionar foto" />
              </form>
              <br />
              <input type="text" id="userName" className="input-edit" placeholder="Nome Completo" />
              <br />
              <input type="text" id="email" className="input-edit" placeholder="E-mail" />
              <br />
              <input type="text" id="age" className="input-edit" placeholder="Idade" />
              <br />
              <input type="text" id="gender" className="input-edit" placeholder="Gênero"  />
              <br />
            </div>

            <div className="container-second-content-edit">
              <div className="weightHight-edit">
                <input type="text" id="weight" className="input-weight-edit" placeholder="Peso"  />
                <input type="text" id="height" className="input-hight-edit" placeholder="Altura"  />
              </div>
              <br />
              <input type="text" id="password" className="input-edit" placeholder="Senha" />

              <input
                type="text"
                id="passwordCheck"
                className="input-edit"
                placeholder="Confirme a senha"
               
              />
              <br />
              <div className="diveditprofessionalProfile">
                <label className="editprofessionalProfile">Perfil Profissional?</label>
                <br />
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
                <br />
              </div>
              <input type="text" id="occupation" className="input-edit" placeholder="Profissão"  />
            </div>
          </div>
          <div className="divButton-edit">
            <Button
              category="primary"
              label="Editar"
              onClick={async () => {
                let userName = (document.getElementById("userName") as HTMLInputElement)?.value;
                let email = (document.getElementById("email") as HTMLInputElement)?.value;
                let occupation = (document.getElementById("occupation") as HTMLInputElement)?.value;
                let password = (document.getElementById("password") as HTMLInputElement)?.value;
                let age = (document.getElementById("age") as HTMLInputElement)?.value;
                let gender = (document.getElementById("gender") as HTMLInputElement)?.value;
                let weight = (document.getElementById("weight") as HTMLInputElement)?.value;
                let height = (document.getElementById("height") as HTMLInputElement)?.value;
                let passwordCheck = document.getElementById("passwordCheck")?.textContent;

                let updatedUser = {
                  ...user,
                  userName,
                  email,
                  occupation,
                  password,
                  age,
                  gender,
                  weight,
                  height,
                  passwordCheck,
                };
                console.log(updatedUser);

                const responseLogin = await fetch(`https://localhost/login`, {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                });
                if (!responseLogin.ok) {
                  console.error("Erro ao atualizar o usuário.");
                }
                console.log(responseLogin.headers.forEach(console.log));
                let setCookie = responseLogin.headers.get("Set-Cookie");
                console.log(setCookie);

                const response = await fetch(`https://localhost/users/${params.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(updatedUser),
                  headers: { "Content-Type": "application/json","x-acces-token": setCookie},
                });

                if (!response.ok) {
                  console.error("Erro ao atualizar o usuário.");
                }
              }}
            />
          </div>
          <div className="divDeleteAccount-edit">
            <Button
              category="primary"
              label="Deletar Conta"
              onClick={async () => {
                const response = await fetch(`https://localhost/users/${params.id}`, {
                  method: "DELETE",
                });

                if (!response.ok) {
                  console.error("Erro ao deletar a conta do usuário.");
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
