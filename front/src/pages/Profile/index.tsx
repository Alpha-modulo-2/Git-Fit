import "./styles.css"
import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleProgressBar } from "../../components/CircleProgressBar";
import { PhotoProfile } from "../../components/PhotoProfile";

export const Profile = () => {
   let imc = "IMC: Sobrepeso";
   let user_name = "Mona Lisa";
   let progress1 = 56;
   let progress2 = 22;
   let progress3 = 77;
   let mediaimc = 22.5;
    return (
      <div className="profile">
         <Header isLoggedIn={true}/>

         <div className="container-profile">
            <PhotoProfile user_name={user_name} url_photo="https://www.mirales.es/sites/default/files/styles/hero_desktop/public/heros/Foto-de-perfil.jpg"/>
            <div className="container-progress-bar">
               <div className="div-progress-bar">
               <ProgressBar progress={progress1} title_bar="Alimentação"/>
               <CircleProgressBar progress={progress1} title_bar={""}/>
               </div >
               <div className="div-progress-bar">
               <ProgressBar progress={progress2} title_bar="Exercícios"/>
               <CircleProgressBar progress={progress2} title_bar={""}/>
               </div>
               <div className="div-progress-bar">
               <ProgressBar progress={progress3} title_bar={imc}/>
               <CircleProgressBar progress={99} title_bar={mediaimc}/>
               </div>




            </div>
         </div>
      </div>
    );
  };
  