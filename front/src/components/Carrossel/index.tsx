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
            <DailyCard week_number={0}  dataChanged={false} onClick={() => navigate('/fullcard/1')}></DailyCard>
            <DailyCard week_number={1}  dataChanged={false} onClick={() => navigate('/fullcard/2')}></DailyCard>
            <DailyCard week_number={2}  dataChanged={false} onClick={() => navigate('/fullcard/3')}></DailyCard>
            <DailyCard week_number={3}  dataChanged={false} onClick={() => navigate('/fullcard/4')}></DailyCard>
            <DailyCard week_number={4}  dataChanged={false} onClick={() => navigate('/fullcard/5')}></DailyCard>
            <DailyCard week_number={5}  dataChanged={false} onClick={() => navigate('/fullcard/6')}></DailyCard>
            <DailyCard week_number={6}  dataChanged={false} onClick={() => navigate('/fullcard/7')}></DailyCard>
        </div>
    )
}