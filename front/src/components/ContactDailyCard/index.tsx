// import React from 'react';
import { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
// import data from '../../data.json';
//import currentuser from '../../currentuser.json'
// import { useAuth } from '../../context/authContext';
import { generalRequest } from "../../generalFunction";
import "./styles.css"

interface CardData {
  trainingCard: {
    checked: boolean;
    title: string;
    tasks: { _id: string; description: string }[];
  };
  mealsCard: {
    checked: boolean;
    meals: { _id: string; description: string }[];
  };
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  description: string;
}

interface Meal {
  _id: string;
  description: string;
}

interface CardDataTest {
  card: {
    trainingCard: {
      checked: boolean;
      title: string;
      tasks: Task[];
    };
    mealsCard: {
      checked: boolean;
      meals: Meal[];
    };
    _id: string;
    userId: string;
    name: string;
    created_at: string;
    updated_at: string;
    __v: number;
  }[];
}

interface PropTypes {
  week_number: number;
  onClick?: MouseEventHandler;
  dataChanged: boolean;
  contactId?: string;
}

const weekDays = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda-feira' },
  { id: 2, name: 'Terça-feira' },
  { id: 3, name: 'Quarta-feira' },
  { id: 4, name: 'Quinta-feira' },
  { id: 5, name: 'Sexta-feira' },
  { id: 6, name: 'Sábado' },
  { default: 'Adicione um card' }
];

export const ContactDailyCard = ({ week_number, onClick, dataChanged, contactId }: PropTypes) => {

  const [cardData, setCardData] = useState<CardData[]>([]);
  const [dataResponse, setDataResponse] = useState(false);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  useEffect(() => {
    if (!isDataLoaded && contactId) {
        const fetchInitialCardsData = async () => {
            try {
                const response = await generalRequest(`/allcards/${contactId}`) as CardDataTest;
                const data = response;
                setCardData(data.card);
                if (data) {
                    setDataResponse(true);
                } else {
                    setDataResponse(false);
                }
            } catch (error) {
                setDataResponse(false);
                console.error('Erro ao buscar dados dos cards', error);
            }
            setIsDataLoaded(true);
        };

        fetchInitialCardsData().catch(error => {
            console.error('Erro ao buscar dados dos cards', error);
        });
    }
}, [contactId, isDataLoaded]);

  useEffect(() => {
      setIsDataLoaded(false);
  }, [contactId, dataChanged]);

  let daily_theme = "Nenhum";
  let daily_food = "Nenhum";

  if (dataResponse) {
    const currentCard = cardData.find((card) => card.name === weekDays[week_number].name);
    if (!currentCard) {
      return <div className="structure-daily-card">Card não encontrado para a semana selecionada.</div>;
    }

    const trainingTasks = currentCard.trainingCard.tasks;
    const mealDescriptions = currentCard.mealsCard.meals.map((meal) => meal.description);

    if (trainingTasks.length > 0) {
      daily_theme = trainingTasks.slice(0, 2).map((task) => task.description).join(', ');
      if (trainingTasks.length > 2) {
        daily_theme += ', ...';
      }
    } else {
      daily_theme = "Nenhum Treino!";
    }

    if (mealDescriptions.length > 0) {
      daily_food = mealDescriptions.slice(0, 2).join(', ');
      if (mealDescriptions.length > 2) {
        daily_food += ', ...';
      }
    } else {
      daily_food = "Nenhuma Refeição!";
    }
  }

  return (
    <div className="structure-contact-daily-card" onClick={onClick}>
      <div className="header-card">
        <h3>{weekDays[week_number].name}</h3>
      </div>
      <div className="body-card">
        <div className="training-day-card">
          <h4>Treino:</h4>
          <p>{daily_theme}</p>
        </div>
        <div className="meal-day-card">
          <h4>Refeições:</h4>
          <p>{daily_food}</p>
        </div>
      </div>
    </div>
  );
};