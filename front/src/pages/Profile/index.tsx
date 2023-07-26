import "./styles.css"
import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleProgressBar } from "../../components/CircleProgressBar";
import { PhotoProfile } from "../../components/PhotoProfile";
// import { Carrossel } from "../../components/Carrossel";
import { DailyCard } from "../../components/DailyCard";
import {  NavigateFunction, useNavigate } from 'react-router-dom';
import data from '../../data.json';

const Calc_IMC = ( weight_imc: number, height_imc:number) =>{
   let imc = weight_imc / (height_imc*height_imc);
   let imc_obj = {
      imc_media: imc,
      imc_class: "",
      imc_color: "#00ff3c"
   }
        if(imc < 18.5){
            imc_obj.imc_class= "IMC: Abaixo";
        }
    
        if(imc >= 18.5 && imc < 25){
            imc_obj.imc_class= "IMC: Normal";
        }
    
        if(imc >= 25 && imc < 30){
            imc_obj.imc_class= "IMC: Sobrepeso";
        }
    
        if(imc >= 30){
            imc_obj.imc_class= "IMC: Obesidade";
        }

        return (imc_obj);
    }


export const Profile = () => {
   const navigate: NavigateFunction = useNavigate();
   let user_name = data.users[1].username;
   let weight= data.users[1].weight;
   let heigth = data.users[1].height;
   let user_photo = data.users[1].photo;

   let progress1 = 99;
   let progress2 = 22;
   let calcIMC = Calc_IMC(weight, heigth);
   let progressIMC = (calcIMC.imc_media*100)/40;
   let progressIMCircle = parseInt(progressIMC.toFixed(0));

    return (
      <div className="profile">
         <Header isLoggedIn={true}/>
         <div className="structure-profile">
            <div className="container-profile">
                <PhotoProfile user_name={user_name} url_photo={user_photo}/>
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
                <ProgressBar progress={progressIMC} title_bar={calcIMC.imc_class}/>
                <CircleProgressBar progress={progressIMCircle} title_bar={calcIMC.imc_media.toFixed(1)}/>
                </div>
                </div>
            </div>
            <div className="structure-carrossel">
                    <DailyCard week_number={0} onClick={() => navigate('/fullcard/0')}></DailyCard>
                    <DailyCard week_number={1} onClick={() => navigate('/fullcard/1')}></DailyCard>
                    <DailyCard week_number={2} onClick={() => navigate('/fullcard/2')}></DailyCard>
                    <DailyCard week_number={3} onClick={() => navigate('/fullcard/3')}></DailyCard>
                    <DailyCard week_number={4} onClick={() => navigate('/fullcard/4')}></DailyCard>
                    <DailyCard week_number={5} onClick={() => navigate('/fullcard/5')}></DailyCard>
                    <DailyCard week_number={6} onClick={() => navigate('/fullcard/6')}></DailyCard>
            </div>
         </div>
      </div>
    );
  };
  