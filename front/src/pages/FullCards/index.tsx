import "./styles.css"
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
// import { ProgressBar } from "../../components/ProgressBar";
// import { CircleProgressBar } from "../../components/CircleProgressBar";
// import { PhotoProfile } from "../../components/PhotoProfile";
// // import { Carrossel } from "../../components/Carrossel";
import { DailyCard } from "../../components/DailyCard";
import {  NavigateFunction, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';   
import data from '../../data.json';

const weekDays = [
    { id: 0, name: 'Domingo' },
    { id: 1, name: 'Segunda-feira' },
    { id: 2, name: 'Terça-feira' },
    { id: 3, name: 'Quarta-feira' },
    { id: 4, name: 'Quinta-feira' },
    { id: 5, name: 'Sexta-feira' },
    { id: 6, name: 'Sábado' },
  ];

export const FullCard = () => {
    const navigate: NavigateFunction = useNavigate();
    const { id } = useParams();
    const selectedId = id ?? "1";
    const selectedDay = weekDays.find(day => day.id === parseInt(selectedId));

    let day_Index = data.training.findIndex(training => training._id === selectedId);
    let trainingDay = data.training[day_Index].title;
    let trainingOptions = data.training[day_Index].tasks.map(task => task.description);

    const mealOptions = data.meals[day_Index].meals.map((meal) => ({
        mealname: meal.description,
        ingredients: meal.ingredients,
      }));


    return (
        <div className="fullcard">
            <Header isLoggedIn={true}></Header>
            <div className="structure-fullcard">
                <div className="background-card">
                    <h2>{selectedDay?.name}</h2>
                    <div className="div_training_card">
                        <div className="title_training_card">
                            <h3>Treino:</h3>
                            <Button category="primary" label="Editar Card"></Button>
                        </div>
                        <div className="body_training_card">
                            <h3>{trainingDay}</h3>
                            <ul>
                                {trainingOptions.map((option, index) => (
                                    <li key={index}>{option}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="daily_training_check">
                            <input type="checkbox" className="daily_training_checkbox"></input>
                        </div>
                    </div>
                    <div className="div_meal_card">
                        <div className="title_meal_card">
                            <h3>Refeições:</h3>
                            <Button category="primary" label="Editar Card"></Button>
                        </div>
                        <div className="body_meal_card">
                            {mealOptions.map((mealOption, index) => (
                                <div key={index} className={`ul_meal_0${index + 1}`}>
                                    <h3>{mealOption.mealname}</h3>
                                    <ul>
                                        {mealOption.ingredients.map((ingredient, i) => (
                                            <li key={i}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))} 
                        </div>
                        <div className="daily_meal_check">
                            <input type="checkbox" className="daily_meal_checkbox"></input>
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
  