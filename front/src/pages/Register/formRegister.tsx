import React, { useState } from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOccupationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegisterForm: React.FC<FormProps> = (props) => {
  const [isProfessional, setIsProfessional] = useState(false);

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProfessional(e.target.checked);
  };

  return (
    <form onSubmit={props.onSubmit}>
      <div className="menu-register">
        <div className="container-first-content-register">
          <form
            encType="multipart/form-data"
            method="POST"
            action="/upload"
          >
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

          <input
            type="text"
            className="input-register"
            placeholder="Gênero"
            onChange={props.handleGenderChange}
          />
        </div>

        <div className="container-second-content-register">
          <div className="weightHight-register">
            <input
              type="text"
              className="input-weight-register"
              placeholder="Peso"
              onChange={props.handleWeightChange}
            />
            <input
              type="text"
              className="input-hight-register"
              placeholder="Altura"
              onChange={props.handleHeightChange}
            />
          </div>

          <input
            type="text"
            className="input-register"
            placeholder="Senha"
            onChange={props.handlePasswordChange}
          />

          <input
            type="text"
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
