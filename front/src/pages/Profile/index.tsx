import "./styles.css"
import { useEffect, useState } from 'react';
import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleProgressBar } from "../../components/CircleProgressBar";
import { PhotoProfile } from "../../components/PhotoProfile";
// import { Carrossel } from "../../components/Carrossel";
import { DailyCard } from "../../components/DailyCard";
import {  NavigateFunction, useNavigate } from 'react-router-dom';
import currentuser from '../../currentuser.json'


const convertToNumber = (stringValue: string) => {
    const numericValue = stringValue.replace(/\D/g, '');
    const numberValue = parseFloat(numericValue) / (stringValue.includes('cm') ? 100 : 1);
    return numberValue;
  };

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
    let userId = currentuser.id;
    const [userData, setUserData] = useState<any>(null);
    const [cardData, setCardData] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`http://localhost:3000/users/${userId}`);
            const data = await response.json();
            setUserData(data);
          } catch (error) {
            console.error('Erro ao buscar dados do usuário', error);
          }
        };

        const fetchCardsData = async () => {
          try {
            const response = await fetch(`http://localhost:3000/allcards/${userId}`);
            const data = await response.json();
            setCardData(data);
          } catch (error) {
            console.error('Erro ao buscar dados dos cards', error);
          }
        };
        fetchUserData();
        fetchCardsData();
      }, []);

   let user_name = "";
   let weight= 0;
   let heigth = 0;
   let user_photo = "https://www.logolynx.com/images/logolynx/b4/b4ef8b89b08d503b37f526bca624c19a.jpeg";
   
   if(userData != null){
    user_name = userData.userName;
    weight = convertToNumber(userData.weight);
    heigth = convertToNumber(userData.height);
    if(userData.photo){
        user_photo = userData.photo;
    }
   }
   let calcIMC = Calc_IMC(weight, heigth);
   let progressIMC = (calcIMC.imc_media*100)/40;
   let progressIMCircle = parseInt(progressIMC.toFixed(0));

   //consoles
   console.log(heigth);
   console.log(weight);
   console.log(calcIMC);
   console.log(cardData);
   //-------------------------
    const countTrainingCheckboxes = () => {
        let totalDays = cardData.length;
        let checkedDays = cardData.filter((day) => day.trainingCard.checked).length;
        return (checkedDays / totalDays) * 100;
    };

       //consoles
   console.log(weight);
   console.log(calcIMC);
   console.log(cardData);
   //-------------------------
    // Função para contar a quantidade de checkboxes marcados para alimentação
    const countMealCheckboxes = () => {
        let totalDays = cardData.length;
        let checkedDays = cardData.filter((day) => day.mealsCard.checked).length;
        return (checkedDays / totalDays) * 100;
    };

    let progress1 = parseInt(countMealCheckboxes().toFixed(0));
    let progress2 = parseInt(countTrainingCheckboxes().toFixed(0));

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
  