import "./styles.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

export const PerfilEdit = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="PerfilEdit">
      <Header isLoggedIn={true} />
      <div className="All-content">
        <div className="container-edit-content">
          <div className="menu">

            <div className="container-first-content">

              <form encType="multipart/form-data" method="POST" action="/upload">
                <label htmlFor="photo-upload" className="custom-file-label button-add-photo"></label>
                <input id="photo-upload" className="custom-file-input" type="file" name="photo" accept="image/*" />
                <input type="submit" className="addPhoto" value="Adicionar foto" />
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

            <div className="container-second-content">

              <input type="text" className="input-edit" placeholder="Gênero" />
              <br />
              <div className="pesoAltura">
                <input type="text" className="input-pesoAltura" placeholder="Peso" />
                <input type="text" className="input-pesoAltura" placeholder="Altura" />
              </div>
              <br />
              <input type="text" className="input-edit" placeholder="Senha" />
              <br />
              <input type="text" className="input-edit" placeholder="Confirme a senha" />
              <br />
              <div className="align-left">
                <label className="perfilProfissional">Perfil Profissional?</label>
                <br />
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="divButton">
            <Button category="primary" label="Cadastrar" onClick={() => navigate("/register")} />
          </div>
        </div>
      </div>
    </div>
  );
};
