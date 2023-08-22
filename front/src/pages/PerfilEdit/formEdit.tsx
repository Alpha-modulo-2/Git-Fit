import React, { useState, useEffect } from "react";

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
  inputsAgeValue: number;
  inputsGenderValue: string;
  inputNameValue: string;
  inputsWeightValue: string;
  inputsHeightValue: string;
  inputsPasswordValue: string;
  inputsOccupationValue: string;
}

export default function EditForm(props: FormProps) {
  const [isProfessional, setIsProfessional] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(`./uploads/${props.inputsPhotoValue}`);

  const handleLocalPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedPhoto(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (props.inputsOccupationValue) {
      setIsProfessional(true);
      setOccupation(props.inputsOccupationValue);
    }
  }, [props.inputsOccupationValue]);

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked: boolean = e.target.checked
    setIsProfessional(isChecked);

    if (!isChecked) {
      setOccupation('');
    }
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProfessional(e.target.checked);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "");
    props.handleWeightChange({
      target: { value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "");
    props.handleHeightChange({
      target: { value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form onSubmit={props.onSubmit} className="form-edit-allcontent">
      <div className="menu-edit">
        <div className="container-first-content-edit">
          <div className="container-choose-photo-edit">
          <form encType="multipart/form-data" method="PATCH" action="/upload">
            <img
              src={selectedPhoto}
              alt="Foto do usuário"
              className="custom-file-label-edit"
              onClick={() => {
                const input = document.getElementById("photo-upload");
                if (input) {
                  input.click();
                }
              }}
            />
            <input
              id="photo-upload"
              className="custom-file-input-edit"
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleLocalPhotoChange}
            />
          </form>
            <label htmlFor="photo-upload"><p>Alterar foto</p></label>
          </div>

          <input
            type="text"
            className="input-edit"
            placeholder="Nome do Usuário"
            value={props.inputsUserNameValue}
            onChange={props.handleUserNameChange}
            minLength={5}
          />

          <input
            type="text"
            className="input-edit"
            placeholder="E-mail"
            value={props.inputsEmailValue}
            onChange={props.handleEmailChange}
          />

          <input
            type="number"
            className="input-edit input-edit-age"
            placeholder="Idade"
            value={props.inputsAgeValue || ''}
            onChange={props.handleAgeChange}
        />

          <select
            className="select-gender-edit"
            onChange={props.handleGenderChange}
            value={props.inputsGenderValue}
          >
            <option value="">Selecione o Gênero</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div className="container-second-content-edit">
          <div className="container-height-weight-edit">
            <div  className="container-input-weight-edit">
              <input
                type="text"
                className="input-weight-edit"
                placeholder="Peso"
                value={props.inputsWeightValue}
                onChange={handleWeightChange}
              />
              <p className="input-weight-edit-text">kg</p>
            </div>
            <div className="container-input-hight-edit">
              <input
              type="text"
              className="input-hight-edit"
              placeholder="Altura"
              value={props.inputsHeightValue}
              onChange={handleHeightChange}
              />
              <p className="input-hight-edit-text">cm</p>
            </div>
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
              <input type="checkbox" checked={isProfessional} onChange={handleSwitchChange} />
              <span className="sliderR-round"></span>
            </label>
          </div>

          {isProfessional && (
            <input
              type="text"
              className="input-edit"
              placeholder="Profissão"
              value={occupation}
              onChange={handleOccupationChange}
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
