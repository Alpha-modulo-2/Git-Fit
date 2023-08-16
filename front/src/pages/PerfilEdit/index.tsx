import "./editStyle.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Form from "./formEdit";
import IUpdateUserData from "../../interfaces/IUpdateUserData";
import { useParams } from "react-router-dom";

export const PerfilEdit = () => {
  const { id } = useParams();
  const userId = id ?? "";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://localhost:443/users/${userId}`);
        if (response.ok) {
          const userData = (await response.json()) as IUpdateUserData;
          setNameValue(userData.name);
          setUserNameValue(userData.userName);
          setEmailValue(userData.email);
          setPhotoValue(userData.photo);
          setGenderValue(userData.gender);
          setWeightValue(userData.weight);
          setHeightValue(userData.height);
          setOccupationValue(userData.occupation);
          setAgeValue(parseInt(userData.age, 10).toString());
          
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
      age
    };
    if (password !== confirmPasswordValue) {
      console.log("As senhas não coincidem.");
      alert("As senhas não coincidem.");
      return;
    }

    void fetch(`https://localhost:443/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then((response) => {
      if (response.ok) {
        console.log("Perfil atualizado com sucesso!");
        setIsLoggedIn(true);
        navigate("/profile");
      } else {
        console.log(response);
        console.log(userId);
      }
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };
  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };
  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordValue(event.target.value);
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
  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeightValue(event.target.value);
  };
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeightValue(event.target.value);
  };
  const handleOccupationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOccupationValue(event.target.value);
  };
  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenderValue(event.target.value);
  };
  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAgeValue = event.target.value;
    setAgeValue(newAgeValue);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir sua conta?"
    );
    if (confirmed) {
      fetch(`https://localhost:443/users/${userId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Usuário excluído com sucesso!");
            alert("usuário deletado com sucesso!");
            navigate("/profile");
          } else {
            console.error("Erro ao excluir usuário:", response);
            alert("erro ao deletar usuário");
          }
        })
        .catch((error) => {
          console.error("Erro ao excluir usuário:", error);
          alert("erro ao deletar usuário");
        });
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
            inputsUserNameValue={userNameValue}
            inputsEmailValue={emailValue}
            inputsAgeValue={ageValue}
            inputsGenderValue={genderValue}
            inputNameValue={nameValue}  
            inputsWeightValue={weightValue}
            inputsHeightValue={heightValue}
            inputsPasswordValue={passwordValue}
            inputsOccupationValue={occupationValue}

            onSubmit={handleSubmit}
            inputsPhotoValue={""} 
            handlePhotoChange={handlePhotoChange}
            handleUserNameChange={handleUserNameChange}
            handleEmailChange={handleEmailChange}
            handleAgeChange={handleAgeChange}
            handleGenderChange={handleGenderChange}
            handleNameChange={handleNameChange}
            handleWeightChange={handleWeightChange}
            handleHeightChange={handleHeightChange}
            handlePasswordChange={handlePasswordChange}
            handleConfirmPasswordChange={handleConfirmPasswordChange}
            handleOccupationChange={handleOccupationChange}
            handleDeleteAccount={handleDeleteAccount}
                    />
        </div>
      </div>
    </div>
  );
};
