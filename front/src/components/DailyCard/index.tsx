// import React from 'react';
import { MouseEventHandler } from 'react';
import data from '../../data.json';
import "./styles.css"

interface PropTypes {
  week_number: number;
  onClick?: MouseEventHandler;
}

const weekDays = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda-Feira' },
  { id: 2, name: 'Terça-Feira' },
  { id: 3, name: 'Quarta-Feira' },
  { id: 4, name: 'Quinta-Feira' },
  { id: 5, name: 'Sexta-Feira' },
  { id: 6, name: 'Sábado' },
];

export const DailyCard = ({ week_number, onClick }: PropTypes) => {
  const selectedDay = weekDays.find(day => day.id === week_number);
  const trainingIndex = data.training.findIndex(training => training._id === week_number.toString());
  const mealIndex = data.meals.findIndex(meal => meal._id === week_number.toString());

  const daily_theme = data.training[trainingIndex].title;

  const daily_food = data.meals[mealIndex].meals.map(meal => meal.description).join(', ');

  return (
    <div className="structure-daily-card" onClick={onClick}>
      <div className="header-card">
        <h2>{selectedDay?.name}</h2>
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
