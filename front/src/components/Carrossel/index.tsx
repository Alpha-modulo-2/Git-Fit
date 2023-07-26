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
            <DailyCard week_number={0} onClick={() => navigate('/fullcard/1')}></DailyCard>
            <DailyCard week_number={1} onClick={() => navigate('/fullcard/2')}></DailyCard>
            <DailyCard week_number={2} onClick={() => navigate('/fullcard/3')}></DailyCard>
            <DailyCard week_number={3} onClick={() => navigate('/fullcard/4')}></DailyCard>
            <DailyCard week_number={4} onClick={() => navigate('/fullcard/5')}></DailyCard>
            <DailyCard week_number={5} onClick={() => navigate('/fullcard/6')}></DailyCard>
            <DailyCard week_number={6} onClick={() => navigate('/fullcard/7')}></DailyCard>
        </div>
    )
}