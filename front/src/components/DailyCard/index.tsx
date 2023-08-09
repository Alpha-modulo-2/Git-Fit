// import React from 'react';
import { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
// import data from '../../data.json';
import currentuser from '../../currentuser.json'
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
  name: string;
}

interface PropTypes {
  week_number: number;
  onClick?: MouseEventHandler;
}

const weekDays = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda-feira' },
  { id: 2, name: 'Terça-feira' },
  { id: 3, name: 'Quarta-feira' },
  { id: 4, name: 'Quinta-feira' },
  { id: 5, name: 'Sexta-feira' },
  { id: 6, name: 'Sábado' },
  { default: 'Adicione um card'}
];

export const DailyCard = ({ week_number, onClick }: PropTypes) => {

  let userId = currentuser.id;
    const [cardData, setCardData] = useState<CardData[]>([]);

    useEffect(() => {
        const fetchCardsData = async () => {
          try {
            const response = await fetch(`http://localhost:3000/allcards/${userId}`);
            const data = await response.json();
            setCardData(data);
          } catch (error) {
            console.error('Erro ao buscar dados dos cards', error);
          }
        };
        fetchCardsData();
      }, []);

  const currentCard = cardData.find((card) => card.name === weekDays[week_number].name);
  if (!currentCard) {
    return <div className="structure-daily-card">Card não encontrado para a semana selecionada.</div>;
  }
  
  const daily_theme = currentCard.trainingCard.title;
  const daily_food = currentCard.mealsCard.meals.map((meal) => meal.description).join(', ');

  return (
    <div className="structure-daily-card" onClick={onClick}>
      <div className="header-card">
        <h2>{weekDays[week_number].name}</h2>
      </div>
      <div className="body-card">
        <div className="training-day-card">
          <h3>Treino:</h3>
          <p>{daily_theme}</p>
        </div>
        <div className="meal-day-card">
          <h3>Refeições:</h3>
          <p>{daily_food}</p>
        </div>
      </div>
    </div>
  );
};
