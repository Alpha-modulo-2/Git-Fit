import React, { useState } from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // ajustado para corresponder à sua implementação
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
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleLocalPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedPhoto(reader.result as string);
        props.handlePhotoChange(e); // Chamando a função passada via prop
      };

      reader.readAsDataURL(file);
    }
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProfessional(e.target.checked);
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^a-zA-Z]/g, "");
    props.handleUserNameChange({
      target: { value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "");
    props.handleWeightChange({
      target: { value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "");
    props.handleHeightChange({
      target: { value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form onSubmit={props.onSubmit} className="form-register-allcontent">
      <div className="menu-register">
        <div className="container-first-content-register">
          <div className="container-choose-photo-register">
            <form encType="multipart/form-data" method="POST" action="/upload" >
              {selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt="Selected"
                  className="custom-file-label-register"
                  onClick={() => {
                    const input = document.getElementById("photo-upload");
                    if (input) {
                      input.click();
                    }
                  }}
                />
              ) : (
                <label htmlFor="photo-upload" className="custom-file-label-register">
                </label>
              )}
              <input
                id="photo-upload"
                className="custom-file-input-register"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleLocalPhotoChange}
              />
            </form>
            <label htmlFor="photo-upload"><p>Adicionar foto</p></label>
          </div>

          <input
            type="text"
            className="input-register"
            placeholder="Nome do Usuário"
            onChange={handleUserNameChange}
            value={props.userNameValue}
            minLength={5}
          />

          <input
            type="text"
            className="input-register"
            placeholder="E-mail"
            onChange={props.handleEmailChange}
          />

          <input
            type="number"
            className="input-register input-register-age"
            placeholder="Idade"
            onChange={props.handleAgeChange}
          />

          <select
            className="select-gender-register"
            onChange={props.handleGenderChange}
            value={props.genderValue}
            
          >
            <option value="" disabled selected hidden>Selecione o gênero</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div className="container-second-content-register">
          <div className="weightHight-register">
            <input
                type="text"
                className="input-register"
                placeholder="Nome Completo"
                onChange={props.handleNameChange}
                value={props.nameValue}
                minLength={6}
            />
            <div className="container-height-weight-register">
              <div  className="container-input-weight-register">
                <input
                  type="text"
                  className="input-weight-register"
                  placeholder="Peso"
                  onChange={handleWeightChange}
                  value={props.weightValue}
                />
                  <p className="input-weight-register-text">kg</p>
              </div>
              <div className="container-input-hight-register">
                <input
                  type="text"
                  className="input-hight-register"
                  placeholder="Altura"
                  onChange={handleHeightChange}
                  value={props.heightValue}
                />
                  <p className="input-hight-register-text">cm</p>
              </div>
            </div>
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
            minLength={5}
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