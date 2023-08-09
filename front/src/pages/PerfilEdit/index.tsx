import "./styles.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Form from "./formEdit";
import IUpdateUserData from "../../interfaces/IUpdateUserData";
import { useParams } from "react-router-dom";

export const PerfilEdit = () => {
  const { id } = useParams();
  const userId = id ?? "";
  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [photoValue, setPhotoValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [occupationValue, setOccupationValue] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (response.ok) {
          const userData = await response.json() as IUpdateUserData;

          setUserNameValue(userData.userName);
          setPasswordValue(userData.password);
          setEmailValue(userData.email);
          setPhotoValue(userData.photo);
          setGenderValue(userData.gender);
          setWeightValue(userData.weight);
          setHeightValue(userData.height);
          setOccupationValue(userData.occupation);
          setAgeValue(userData.age.toString());
        } else {
          console.error("Erro ao buscar dados do usuário.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    void fetchUserData();
  }, [userId]);

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
      age,
    };
    void fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then((response) => {
      if (response.ok) {
        console.log("Perfil atualizado com sucesso!");
        setIsLoggedIn(true);
        console.log(isLoggedIn);
        console.log(response);
      } else {
        console.log(response);
        console.log(userId);
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


  
  const handleDeleteAccount = async () => {
    try {
      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });
      console.log("Usuário excluído com sucesso!");
      // Aqui você pode redirecionar o usuário para outra página, exibir uma mensagem de sucesso, etc.
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      // Aqui você pode tratar o erro de acordo com sua necessidade.
    }
  };

  if (isLoggedIn) {
    navigate("/profile");
  }

  return (
    <div className="Edit">
      <Header isLoggedIn={isLoggedIn} />
      <div className="All-content-edit">
        <div className="container-edit-content">
          <Form
            inputsNameValue={userNameValue}
            inputsEmailValue={emailValue}
            inputsPasswordValue={passwordValue}
            inputsGenderValue={genderValue}
            inputsWeightValue={weightValue}
            inputsHeightValue={heightValue}
            inputsOccupationValue={occupationValue}
            inputsAgeValue={ageValue}
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
            handleDeleteAccount={handleDeleteAccount}
            inputsPhotoValue={""}
          />
        </div>
      </div>
    </div>
  );
};
