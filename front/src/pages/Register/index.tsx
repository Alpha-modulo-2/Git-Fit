import "./registerStyle.css";
import { Header } from "../../components/Header";
import { useState } from "react";
import RegisterForm from "./formRegister";
import IUpdateUserData from "../../interfaces/IUpdateUserData";

export const Register = () => {
  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [photoValue, setPhotoValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [occupationValue, setOccupationValue] = useState("");
  const [ageValue, setAgeValue] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      userName,
      password,
      email,
      photo,
      gender,
      weight,
      height,
      occupation,
      age
    };
    void fetch("http://localhost:3000/users", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then((response) => {
      if (response.ok) {
        console.log("Perfil CRIADO com sucesso!");
        console.log(response);
      } else {
        console.log(response);
      }
    });    
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameValue(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoValue(event.target.value);
  };
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <Header isLoggedIn={true} />
      <div className="All-content-register">
        <div className="container-register-content">
          <RegisterForm
            onSubmit={handleSubmit}
            handleUserNameChange={handleUserNameChange}
            handlePasswordChange={handlePasswordChange}
            handleEmailChange={handleEmailChange}
            handlePhotoChange={handlePhotoChange}
            handleGenderChange={handleGenderChange}
            handleWeightChange={handleWeightChange}
            handleHeightChange={handleHeightChange}
            handleOccupationChange={handleOccupationChange}
            handleAgeChange={handleAgeChange}
          />
        </div>
      </div>
    </div>
  );
};
