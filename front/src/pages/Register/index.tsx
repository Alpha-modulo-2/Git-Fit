import "./styles.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

export const Register = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="Register">
      <Header isLoggedIn={true} />
      <div className="All-content-register">
        <div className="container-register-content">
          <div className="menu-register">
            <div className="container-first-content-register">
              <form encType="multipart/form-data" method="POST" action="/upload">
                <label htmlFor="photo-upload" className="custom-file-label-register"></label>
                <input id="photo-upload" className="custom-file-input-register" type="file" name="photo" accept="image/*" />
                <input type="submit" className="addPhoto-register" value="Adicionar foto" />
              </form>
              <br />
              <input type="text" className="input-register" placeholder="Nome Completo" />
              <br />
              <input type="text" className="input-register" placeholder="E-mail" />
              <br />
              <input type="text" className="input-register" placeholder="Idade" />
              <br />
              <input type="text" className="input-register" placeholder="Gênero" />
            </div>

            <div className="container-second-content-register">

              <div className="weightHight-register">
                <input type="text" className="input-weight-register" placeholder="Peso" />
                <input type="text" className="input-hight-register" placeholder="Altura" />
              </div>
              <br />
              <input type="text" className="input-register" placeholder="Senha" />
              <br />
              <input type="text" className="input-register" placeholder="Confirme a senha" />
              <br />
              <div className="divregisterprofessionalProfile">
                <label className="registerprofessionalProfile">Perfil Profissional?</label>
                <br />
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <br />
              <input type="text" className="input-register" placeholder="Profissão" />
            </div>
          </div>

          <div className="divButton">
            <Button category="primary" label="Cadastrar" onClick={() => navigate("/")} />
          </div>
          
        </div>
      </div>
    </div>
  );
};
