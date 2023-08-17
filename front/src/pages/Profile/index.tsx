import "./styles.css"
import { useEffect, useState } from 'react';
import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleProgressBar } from "../../components/CircleProgressBar";
import { PhotoProfile } from "../../components/PhotoProfile";
// import { Carrossel } from "../../components/Carrossel";
import { DailyCard } from "../../components/DailyCard";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
//import currentuser from '../../currentuser.json'

const convertToNumber = (stringValue: string) => {
  const numericValue = stringValue ? stringValue.replace(/\D/g, '') : '';
  const numberValue = parseFloat(numericValue) / (stringValue && stringValue.includes('cm') ? 100 : 1);
  return numberValue;
};

const Calc_IMC = (weight_imc: number, height_imc: number) => {
  const imc = weight_imc / (height_imc * height_imc);
  const imc_obj = {
    imc_media: imc,
    imc_class: "",
    imc_color: "#00ff3c"
  }
  if (imc < 18.5) {
    imc_obj.imc_class = "IMC: Abaixo";
  }
  if (imc >= 18.5 && imc < 25) {
    imc_obj.imc_class = "IMC: Normal";
  }
  if (imc >= 25 && imc < 30) {
    imc_obj.imc_class = "IMC: Sobrepeso";
  }
  if (imc >= 30) {
    imc_obj.imc_class = "IMC: Obesidade";
  }
  return (imc_obj);
}


export const Profile = () => {
  const navigate: NavigateFunction = useNavigate();

  const { user } = useAuth();
  // const { isLoggedIn, login, user } = useAuth();
  // console.log(isLoggedIn, login, user, 'login');
  const userId = String(user?._id);

  const [userData, setUserData] = useState<any>(null);
  const [cardData, setCardData] = useState<any>([]);

  const urlPath = import.meta.env.VITE_URL_PATH;

  if (!urlPath) {
    throw new Error('URL_PATH is not defined');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${urlPath}/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário', error);
      }
    };

    const fetchCardsData = async () => {
      try {
        const response = await fetch(`${urlPath}/allcards/${userId}`);
        const data = await response.json();
        setCardData(data.card);
      } catch (error) {
        console.error('Erro ao buscar dados dos cards', error);
      }
    };
    fetchUserData();
    fetchCardsData();
  }, []);

  let user_name = "";
  let weight = 0;
  let heigth = 0;
  let user_photo = "https://www.logolynx.com/images/logolynx/b4/b4ef8b89b08d503b37f526bca624c19a.jpeg";

  if (userData != null) {
    user_name = userData.userName;
    weight = convertToNumber(userData.weight);
    heigth = convertToNumber(userData.height);
    if (userData.photo) {
      user_photo = userData.photo;
    }
  }
  const calcIMC = Calc_IMC(weight, heigth);
  const progressIMC = (calcIMC.imc_media * 100) / 40;
  const progressIMCircle = parseInt(progressIMC.toFixed(0));

  const countTrainingCheckboxes = () => {
    const totalDays = cardData.length;
    const checkedDays = Array.isArray(cardData) ? cardData.filter((day) => day.trainingCard.checked).length : 0;
    if (isNaN(checkedDays)) {
      return 0;
    } else {
      return (checkedDays / totalDays) * 100;
    }
  };

  const countMealCheckboxes = () => {
    const totalDays = cardData.length;
    const checkedDays = Array.isArray(cardData) ? cardData.filter((day) => day.mealsCard.checked).length : 0;
    if (isNaN(checkedDays)) {
      return 0;
    } else {
      return (checkedDays / totalDays) * 100;
    }
  };

  const progress1 = parseInt(countMealCheckboxes().toFixed(0));
  const progress2 = parseInt(countTrainingCheckboxes().toFixed(0));

  return (
    <div className="profile">
      <Header isLoggedIn={true} />
      <div className="structure-profile">
        <div className="container-profile">
          <PhotoProfile user_name={user_name} url_photo={user_photo} />
          <div className="container-progress-bar">
            <div className="div-progress-bar">
              <ProgressBar progress={progress1} title_bar="Alimentação" />
              <CircleProgressBar progress={progress1} title_bar={""} />
            </div >
            <div className="div-progress-bar">
              <ProgressBar progress={progress2} title_bar="Exercícios" />
              <CircleProgressBar progress={progress2} title_bar={""} />
            </div>
            <div className="div-progress-bar">
              <ProgressBar progress={progressIMC} title_bar={calcIMC.imc_class} />
              <CircleProgressBar progress={progressIMCircle} title_bar={calcIMC.imc_media.toFixed(1)} />
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
