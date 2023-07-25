import "./styles.css"
import { DailyCard } from "../DailyCard"
import {  NavigateFunction, useNavigate } from 'react-router-dom';
// import { MouseEventHandler } from 'react';

// interface PropTypes {
//     onClick?: MouseEventHandler;
// }

export const Carrossel = () => {
    const navigate: NavigateFunction = useNavigate();
    return(
        <div className="structure-carrossel">
            <DailyCard week_number={1} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/1')}></DailyCard>
            <DailyCard week_number={2} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/2')}></DailyCard>
            <DailyCard week_number={3} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/3')}></DailyCard>
            <DailyCard week_number={4} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/4')}></DailyCard>
            <DailyCard week_number={5} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/5')}></DailyCard>
            <DailyCard week_number={6} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/6')}></DailyCard>
            <DailyCard week_number={7} daily_theme={"Braços"} daily_food={"Arroz"} onClick={() => navigate('/fullcard/7')}></DailyCard>
        </div>
    )
}