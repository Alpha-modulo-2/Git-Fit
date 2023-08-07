import React from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOccupationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteAccount: () => void;

  inputsNameValue: string;
  inputsEmailValue: string;
  inputsPasswordValue: string;
  inputsPhotoValue: string;
  inputsGenderValue: string;
  inputsWeightValue: string;
  inputsHeightValue: string;
  inputsOccupationValue: string;
  inputsAgeValue: string;
}

export default function Form(props: FormProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="menu-edit">
        <div className="container-first-content-edit">
          <form encType="multipart/form-data" method="POST" action="/upload">
            <label htmlFor="photo-upload" className="custom-file-label-edit">
              {props.inputsPhotoValue}
            </label>
            <input
              id="photo-upload"
              className="custom-file-input-edit"
              type="file"
              name="photo"
              accept="image/*"
              onChange={props.handlePhotoChange}
              value={props.inputsPhotoValue}
            />
            <input
              type="submit"
              className="addPhoto-edit"
              value="Adicionar foto"
            />
          </form>
          <br />
          <input
            type="text"
            className="input-edit"
            placeholder="Nome Completo"
            onChange={props.handleUserNameChange}
            value={props.inputsNameValue}
          />
          <br />
          <input
            type="text"
            className="input-edit"
            placeholder="E-mail"
            onChange={props.handleEmailChange}
            value={props.inputsEmailValue}
          />
          <br />
          <input
            type="number"
            className="input-edit"
            placeholder="Idade"
            onChange={props.handleAgeChange}
            value={props.inputsAgeValue}
          />
          <br />
          <input
            type="text"
            className="input-edit"
            placeholder="Gênero"
            onChange={props.handleGenderChange}
            value={props.inputsGenderValue}
          />
          <br />
        </div>

        <div className="container-second-content-edit">
          <div className="weightHight-edit">
            <input
              type="text"
              className="input-weight-edit"
              placeholder="Peso"
              onChange={props.handleWeightChange}
              value={props.inputsWeightValue}
            />
            <input
              type="text"
              className="input-hight-edit"
              placeholder="Altura"
              onChange={props.handleHeightChange}
              value={props.inputsHeightValue}
            />
          </div>
          <br />
          <input
            type="password"
            className="input-edit"
            placeholder="Senha"
            onChange={props.handlePasswordChange}
            value={props.inputsPasswordValue}
          />

          <input
            type="password"
            className="input-edit"
            placeholder="Confirme a senha"
          />
          <br />
          <div className="diveditprofessionalProfile">
            <label className="editprofessionalProfile">
              Perfil Profissional?
            </label>
            <br />
            <label className="switch">
              <input type="checkbox" onChange={props.handleOccupationChange} />
              <span className="slider round"></span>
            </label>
            <br />
          </div>
          <input
            type="text"
            className="input-edit"
            placeholder="Profissão"
            onChange={props.handleOccupationChange}
            value={props.inputsOccupationValue}
          />
        </div>
      </div>
      <div className="divButton-edit">
        <button className="buttonSave" type="submit">Salvar</button>
      </div>
      <div className="divDeleteAccount-edit">
        <button className="deleteAccount-edit" onClick={props.handleDeleteAccount}>
          Excluir Conta
        </button>
      </div>
    </form>
  );
}
