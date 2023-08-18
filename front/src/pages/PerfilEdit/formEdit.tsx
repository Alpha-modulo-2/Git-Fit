import React, { useState } from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOccupationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteAccount: () => void;
  
  inputsPhotoValue: string;
  inputsUserNameValue: string;
  inputsEmailValue: string;
  inputsAgeValue: string;
  inputsGenderValue: string;
  inputNameValue: string;
  inputsWeightValue: string;
  inputsHeightValue: string;
  inputsPasswordValue: string;
  inputsOccupationValue: string;
}

export default function EditForm(props: FormProps) {
  const [isProfessional, setIsProfessional] = useState(false);
  const [weightValue, setWeightValue] = useState(""); 
  const [heightValue, setHeightValue] = useState(""); 
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleLocalPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedPhoto(reader.result as string);
        props.handlePhotoChange(e);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProfessional(e.target.checked);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "") + " Kg";
    setWeightValue(formattedValue);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "") + " cm";
    setHeightValue(formattedValue);
  };

  return (
    <form onSubmit={props.onSubmit}>
      <div className="menu-edit">
        <div className="container-first-content-edit">
          <form encType="multipart/form-data" 
            method="POST" 
            action="/upload">
            {selectedPhoto ? (
              <img
                src={selectedPhoto}
                alt="Selected"
                className="custom-file-label-edit"
                onClick={() => {
                  const input = document.getElementById("photo-upload");
                  if (input) {
                    input.click();
                  }
                }}
              />
            ) : (
              <label htmlFor="photo-upload" className="custom-file-label-edit">
              </label>
            )}
            <input
              id="photo-upload"
              className="custom-file-input-edit"
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleLocalPhotoChange}
            />
          </form>

          <input
            type="text"
            className="input-edit"
            placeholder="Nome do Usuário"
            onChange={props.handleUserNameChange}
          />

          <input
            type="text"
            className="input-edit"
            placeholder="E-mail"
            onChange={props.handleEmailChange}
          />

          <input
            type="number"
            className="input-edit"
            placeholder="Idade"
            onChange={props.handleAgeChange}
          />

          <select
            className="input-edit"
            onChange={props.handleGenderChange}
            value={props.inputsGenderValue}
          >
            <option value="">Selecione o Gênero</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div className="container-second-content-edit">
          <div className="weightHight-edit">
        <input
            type="text"
            className="input-edit"
            placeholder="Nome Completo"
            onChange={props.handleNameChange}
          />
            <input
              type="text"
              className="input-weight-edit"
              placeholder="Peso"
              value={weightValue}
              onChange={handleWeightChange}
            />
            <input
              type="text"
              className="input-hight-edit"
              placeholder="Altura"
              value={heightValue}
              onChange={handleHeightChange}
            />
          </div>

          <input
            type="password"
            className="input-edit"
            placeholder="Senha"
            onChange={props.handlePasswordChange}
          />

          <input
            type="password"
            className="input-edit"
            placeholder="Confirme a senha"
            onChange={props.handleConfirmPasswordChange}
          />

          <div className="diveditprofessionalProfile">
            <label className="editprofessionalProfile">
              Perfil Profissional?
            </label>

            <label className="switch">
              <input type="checkbox" 
                onChange={handleOccupationChange} />
              <span className="sliderR-round"></span>
            </label>
          </div>

          {isProfessional && (
            <input
              type="text"
              className="input-edit"
              placeholder="Profissão"
              onChange={props.handleOccupationChange}
            />
          )}
        </div>
      </div>
      <div className="divButton-edit">
        <button className="buttonLogin" 
          type="submit">
          Salvar
        </button>
      </div>
      <div className="divDeleteAccount-edit">
        <button
          className="deleteAccount-edit"
          onClick={props.handleDeleteAccount}
        >
          Excluir Conta
        </button>
      </div>
    </form>
  );
}
