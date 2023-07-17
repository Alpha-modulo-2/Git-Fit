import "./styles.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

export const PerfilEdit = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="Edit">
      <Header isLoggedIn={true} />
      <div className="All-content-edit">
        <div className="container-edit-content">
          <div className="menu-edit">

            <div className="container-first-content-edit">

              <form encType="multipart/form-data" method="POST" action="/upload">
                <label htmlFor="photo-upload" className="custom-file-label-edit"></label>
                <input id="photo-upload" className="custom-file-input-edit" type="file" name="photo" accept="image/*" />
                <input type="submit" className="addPhoto-edit" value="Adicionar foto" />
              </form>

              <br />
              <input type="text" className="input-edit" placeholder="Nome Completo" />
              <br />
              <input type="text" className="input-edit" placeholder="E-mail" />
              <br />
              <input type="text" className="input-edit" placeholder="Idade" />
              <br />
              <input type="text" className="input-edit" placeholder="Profissão" />
            </div>

            <div className="container-second-content-edit">
              <input type="text" className="input-edit" placeholder="Gênero" />
              <br />
              <div className="weightHight-edit">
                <input type="text" className="input-weightHight-edit" placeholder="Peso" />
                <input type="text" className="input-weightHight-edit" placeholder="Altura" />
              </div>
              <br />
              <input type="text" className="input-edit" placeholder="Senha" />
              <br />
              <input type="text" className="input-edit" placeholder="Confirme a senha" />
              <br />
              <div className="DivprofessionalProfile">
                <label className="professionalProfile">Perfil Profissional?</label>
                <br />
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="divButton-edit">
            <Button category="primary" label="Editar" onClick={() => navigate("/edit")} />
          </div>
          <div className="divDeleteAccount-edit">
          <button className="deleteAccount-edit">Excluir Conta</button>
          </div>
        </div>
      </div>
    </div>
  );
};
