import "./styles.css";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";

export const Register = () => {
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
              <input type="text" id="userName" className="input-register" placeholder="Nome Completo" />
              <br />
              <input type="text" id="email" className="input-register" placeholder="E-mail" />
              <br />
              <input type="text" id="age" className="input-register" placeholder="Idade" />
              <br />
              <input type="text" id="occupation" className="input-register" placeholder="Profissão" />
            </div>

            <div className="container-second-content-register">
              <input type="text" id="gender" className="input-register" placeholder="Gênero" />
              <br />
              <div className="weightHight-register">
                <input type="text" id="weight" className="input-weightHight-register" placeholder="Peso" />
                <input type="text" id="height" className="input-weightHight-register" placeholder="Altura" />
              </div>
              <br />
              <input type="password" id="password" className="input-register" placeholder="Senha" />
              <br />
              <input type="password" id="passwordCheck" className="input-register" placeholder="Confirme a senha" />
              <br />
              <div className="divprofessionalProfile">
                <label className="professionalProfile">Perfil Profissional?</label>
                <br />
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="divButton">
            <Button category="primary" label="Cadastrar" onClick={async () => {
              let userName = (document.getElementById("userName") as HTMLInputElement)?.value;
              let email = (document.getElementById('email') as HTMLInputElement)?.value;
              let occupation = (document.getElementById('occupation') as HTMLInputElement)?.value;
              let password = (document.getElementById('password') as HTMLInputElement)?.value;

              // let passwordCheck = document.getElementById('passwordCheck')?.textContent;

              let user = {userName,  email,  occupation, password};
              console.log(user)
              
              const response = await fetch("http://localhost:3000/users", {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {'Content-Type': 'application/json'} 
              });
          
              if (!response.ok) 
              { 
                  console.error("Error");
              }
 
            }} />
          </div>
          
        </div>
      </div>
    </div>
  );
};
