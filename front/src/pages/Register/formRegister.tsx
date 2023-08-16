import React, { useState } from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOccupationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  nameValue: string;
  userNameValue: string;
  genderValue: string;
  weightValue: string;
  heightValue: string;
}

const RegisterForm: React.FC<FormProps> = (props) => {
  const [isProfessional, setIsProfessional] = useState(false);

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProfessional(e.target.checked);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "") + "kg";
    props.handleWeightChange({
      target: { value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "") + "cm";
    props.handleHeightChange({
      target: { value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form onSubmit={props.onSubmit}>
      <div className="menu-register">
        <div className="container-first-content-register">
          <form encType="multipart/form-data" method="POST" action="/upload">
            <label
              htmlFor="photo-upload"
              className="custom-file-label-register"
            ></label>
            <input
              id="photo-upload"
              className="custom-file-input-register"
              type="file"
              name="photo"
              accept="image/*"
              onChange={props.handlePhotoChange}
            />
          </form>

          <input
            type="text"
            className="input-register"
            placeholder="Nome Completo"
            onChange={props.handleUserNameChange}
            value={props.userNameValue}
          />

          <input
            type="text"
            className="input-register"
            placeholder="E-mail"
            onChange={props.handleEmailChange}
          />

          <input
            type="number"
            className="input-register"
            placeholder="Idade"
            onChange={props.handleAgeChange}
          />

          <select
            className="input-register"
            onChange={props.handleGenderChange}
            value={props.genderValue}
          >
            <option value="">Selecione o Gênero</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div className="container-second-content-register">
          <div className="weightHight-register">
          <input
            type="text"
            className="input-register"
            placeholder="Apelido"
            onChange={props.handleNameChange}
            value={props.nameValue}
          />
            <input
              type="text"
              className="input-weight-register"
              placeholder="Peso"
              onChange={handleWeightChange}
              value={props.weightValue}
            />
            <input
              type="text"
              className="input-hight-register"
              placeholder="Altura"
              onChange={handleHeightChange}
              value={props.heightValue}
            />
          </div>

          <input
            type="password"
            className="input-register"
            placeholder="Senha"
            onChange={props.handlePasswordChange}
          />

          <input
            type="password"
            className="input-register"
            placeholder="Confirme a senha"
            onChange={props.handleConfirmPasswordValue}
          />

          <div className="divregisterprofessionalProfile">
            <label className="registerprofessionalProfile">
              Perfil Profissional?
            </label>

            <label className="switch">
              <input
                type="checkbox"
                checked={isProfessional}
                onChange={handleOccupationChange}
              />
              <span className="sliderR-round"></span>
            </label>
          </div>

          {isProfessional && (
            <input
              type="text"
              className="input-register"
              placeholder="Profissão"
              onChange={props.handleOccupationChange}
            />
          )}
        </div>
      </div>
      <div className="divButton-register">
        <button className="buttonLogin" type="submit">
          Cadastrar
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
