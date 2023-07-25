import "./styles.css";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { useParams } from "react-router-dom";

export const PerfilEdit = () => {
  const params = useParams();
  alert(params.id);
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
              <input type="text" id="userName" className="input-edit" placeholder="Nome Completo" />
              <br />
              <input type="text" id="email" className="input-edit" placeholder="E-mail" />
              <br />
              <input type="text" id="age" className="input-edit" placeholder="Idade" />
              <br />
              <input type="text" id="occupation" className="input-edit" placeholder="Profissão" />
            </div>

            <div className="container-second-content-edit">
              <input type="text" className="input-edit" placeholder="Gênero" />
              <br />
              <div className="weightHight-edit">
                <input type="text" className="input-weightHight-edit" placeholder="Peso" />
                <input type="text" className="input-weightHight-edit" placeholder="Altura" />
              </div>
              <br />
              <input type="text" id="password"className="input-edit" placeholder="Senha" />
              <br />
              <input type="text" className="input-edit" placeholder="Confirme a senha" />
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
            <div className="divButton-edit">
              <Button category="primary" label="Editar" onClick={async () => {
              let userName = (document.getElementById("userName") as HTMLInputElement)?.value;
              let email = (document.getElementById('email') as HTMLInputElement)?.value;
              let occupation = (document.getElementById('occupation') as HTMLInputElement)?.value;
              let password = (document.getElementById('password') as HTMLInputElement)?.value;

              // let passwordCheck = document.getElementById('passwordCheck')?.textContent;

              let user = {userName,  email,  occupation, password};
              console.log(user)
              
              const response = await fetch(`http://localhost:3000/users/${params.id}`, {
                method: 'PATCH',
                body: JSON.stringify(user),
                headers: {'Content-Type': 'application/json'} 
              });
          
              if (!response.ok) 
              { 
                  console.error("Error");
              }
 
            }} />
            </div>
            <div className="divDeleteAccount-edit">
              {/* <button className="deleteAccount-edit" onClick={()=> navigate("/")}>Excluir Conta</button> */}
              <Button category="primary" label="Deletar Conta" onClick={async () => {

              const response = await fetch(`http://localhost:3000/users/${params.id}`, {
                method: 'DELETE',
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
