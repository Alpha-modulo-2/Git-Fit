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

const weekDays = [
    { id: 1, name: 'Domingo' },
    { id: 2, name: 'Segunda-feira' },
    { id: 3, name: 'Terça-feira' },
    { id: 4, name: 'Quarta-feira' },
    { id: 5, name: 'Quinta-feira' },
    { id: 6, name: 'Sexta-feira' },
    { id: 7, name: 'Sábado' },
  ];

export const FullCard = () => {
    const navigate: NavigateFunction = useNavigate();
    const { id } = useParams();
    const selectedId = id ?? "1";
    const selectedDay = weekDays.find(day => day.id === parseInt(selectedId));

    let trainingDay = "Membros Inferiores";
    let trainingOptions = {
        opt1: "Extensora Unilateral. Equipamento articulado para treino de pernas",
        opt2: "Flexora Unilateral",
        opt3: "Hip Thrust (Elevação Pélvica)",
        opt4: "Leg Dual System",
        opt5: "Mesa Flexora Unilateral"
    }
    let mealOptions = {
        ref1: {mealname: "Café da Manhã", ing1: "Ovo", ing2:"Batata Doce", ing3: ""},
        ref2: {mealname: "Almoço", ing1: "Arroz", ing2:"Feijão", ing3: "Batata"},
        ref3: {mealname: "Jantar", ing1: "Alface", ing2:"Nozes", ing3: "Tomate"}
    }


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
                                <li>{trainingOptions.opt1}</li>
                                <li>{trainingOptions.opt2}</li>
                                <li>{trainingOptions.opt3}</li>
                                <li>{trainingOptions.opt4}</li>
                                <li>{trainingOptions.opt5}</li>
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
                            <div className="ul_meal_01">
                                <h3>{mealOptions.ref1.mealname}</h3>
                                <ul>
                                    <li>{mealOptions.ref1.ing1}</li>
                                    <li>{mealOptions.ref1.ing2}</li>
                                </ul>
                            </div>
                            <div className="ul_meal_02">
                                <h3>{mealOptions.ref2.mealname}</h3>
                                <ul>
                                    <li>{mealOptions.ref2.ing1}</li>
                                    <li>{mealOptions.ref2.ing2}</li>
                                    <li>{mealOptions.ref2.ing3}</li>
                                </ul>
                            </div>
                            <div className="ul_meal_03">
                                <h3>{mealOptions.ref3.mealname}</h3>
                                <ul>
                                    <li>{mealOptions.ref3.ing1}</li>
                                    <li>{mealOptions.ref3.ing2}</li>
                                    <li>{mealOptions.ref3.ing3}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="daily_meal_check">
                            <input type="checkbox" className="daily_meal_checkbox"></input>
                        </div>
                    </div>
                </div>
                <div className="structure-carrossel">
                        <DailyCard week_number={1} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/1')}></DailyCard>
                        <DailyCard week_number={2} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/2')}></DailyCard>
                        <DailyCard week_number={3} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/3')}></DailyCard>
                        <DailyCard week_number={4} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/4')}></DailyCard>
                        <DailyCard week_number={5} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/5')}></DailyCard>
                        <DailyCard week_number={6} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/6')}></DailyCard>
                        <DailyCard week_number={7} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/7')}></DailyCard>
                </div>
            </div>
        </div>
    );
  };
  