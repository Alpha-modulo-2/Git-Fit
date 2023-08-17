import React, { useState } from "react";
import { Header } from "../../components/Header";
import RegisterForm from "./formRegister";
import "./registerStyle.css";

export const Register = () => {
  const [nameValue, setNameValue] = useState("");
  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [photoValue, setPhotoValue] = useState<File>();
  const [genderValue, setGenderValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [occupationValue, setOccupationValue] = useState("");
  const [ageValue, setAgeValue] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emptyFields: string[] = [];

    if (nameValue === "") {
      emptyFields.push("Apelido");
    }

    if (userNameValue === "") {
      emptyFields.push("Nome Completo");
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
      console.log(`Campos não preenchidos: ${fieldsString}`);
      alert(`Preencha os campos obrigatórios: ${fieldsString}`);
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      console.log("As senhas não coincidem.");
      alert("As senhas não coincidem.");
      return;
    }
    const formData = new FormData();

    // Adicione os campos ao FormData
    formData.append("name", nameValue);
    formData.append("userName", userNameValue);
    formData.append("password", passwordValue);
    formData.append("email", emailValue);
    if (photoValue !== null && photoValue !== undefined) {
      formData.append("photo", photoValue, photoValue.name);
    }
    formData.append("gender", genderValue);
    formData.append("weight", weightValue);
    formData.append("height", heightValue);
    formData.append("occupation", occupationValue);
    formData.append("age", ageValue);
    
    void fetch("https://localhost:443/users", {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.ok) {
        console.log("Perfil CRIADO com sucesso!");
        console.log(response);
      } else {
        console.log(response,'response');
      }
    
    }).catch((err) => {
      console.log(err)
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

  const handleConfirmPasswordValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordValue(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setPhotoValue(file);
    }
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

  const handleOccupationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    </div>
  );
};
