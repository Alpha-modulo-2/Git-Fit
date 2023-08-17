import React, { useState } from "react";
import { Header } from "../../components/Header";
import RegisterForm from "./formRegister";
import IUpdateUserData from "../../interfaces/IUpdateUserData";
import "./registerStyle.css";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Modal";


export const Register = () => {
  const [nameValue, setNameValue] = useState("");
  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [photoValue, setPhotoValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [occupationValue, setOccupationValue] = useState("");
  const [ageValue, setAgeValue] = useState("");

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [messageModal, setMessageModal] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emptyFields: string[] = [];

    if (nameValue === "") {
      emptyFields.push("Nome Completo");
    }

    if (userNameValue === "") {
      emptyFields.push("Nome de Usuário");
    }

    if (emailValue === "") {
      emptyFields.push("E-mail");
    }

    if (ageValue === "") {
      emptyFields.push("Idade");
    }

    if (genderValue === "") {
      emptyFields.push("Gênero");
    }

    if (weightValue === "") {
      emptyFields.push("Peso");
    }

    if (heightValue === "") {
      emptyFields.push("Altura");
    }

    if (passwordValue === "") {
      emptyFields.push("Senha");
    }

    if (confirmPasswordValue === "") {
      emptyFields.push("Confirmação de Senha");
    }

    if (emptyFields.length > 0) {
      const fieldsString = emptyFields.join(", ");
      setMessageModal(`Preencha os campos obrigatórios: ${fieldsString}`);
      openModal();
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      console.log("As senhas não coincidem");
      setMessageModal(`As senhas não coincidem`);
      openModal();
      return;
    }
    const name = nameValue;
    const userName = userNameValue;
    const password = passwordValue;
    const email = emailValue;
    const photo = photoValue;
    const gender = genderValue;
    const weight = weightValue;
    const height = heightValue;
    const occupation = occupationValue;
    const age = ageValue;

    const user: IUpdateUserData = {
      name,
      userName,
      password,
      email,
      photo,
      gender,
      weight,
      height,
      occupation,
      age,
    };

    const urlPath = process.env.URL_PATH;

    if (!urlPath) {
      throw new Error('URL_PATH is not defined');
    }

    void fetch(`${urlPath}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then((response) => {
      if (response.ok) {
        console.log("Perfil CRIADO com sucesso!");
        setMessageModal("Perfil CRIADO com sucesso!");
        openModal();
        navigate("/login");
      } else {
        console.log(response);
      }
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameValue(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const handleConfirmPasswordValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPasswordValue(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoValue(event.target.value);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenderValue(event.target.value);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeightValue(event.target.value);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeightValue(event.target.value);
  };

  const handleOccupationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOccupationValue(event.target.value);
  };

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgeValue(event.target.value);
  };

  return (
    <div className="Register">
      <Header isLoggedIn={false} />
      <div className="All-content-register">
        <div className="container-register-content">
          <RegisterForm
            onSubmit={handleSubmit}
            handleNameChange={handleNameChange}
            handleUserNameChange={handleUserNameChange}
            handlePasswordChange={handlePasswordChange}
            handleEmailChange={handleEmailChange}
            handlePhotoChange={handlePhotoChange}
            handleGenderChange={handleGenderChange}
            handleWeightChange={handleWeightChange}
            handleHeightChange={handleHeightChange}
            handleOccupationChange={handleOccupationChange}
            handleAgeChange={handleAgeChange}
            handleConfirmPasswordValue={handleConfirmPasswordValue}
            nameValue={nameValue}
            userNameValue={userNameValue}
            genderValue={genderValue}
            weightValue={weightValue}
            heightValue={heightValue}
          />
        </div>
      </div>
      {modalIsOpen && <Modal children={messageModal} onClick={closeModal} />}
    </div>
  );
};
