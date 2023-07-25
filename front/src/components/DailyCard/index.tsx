import "./styles.css"
import { MouseEventHandler } from 'react';

interface PropTypes {
    week_number: number;
    daily_theme: string;
    daily_food: string;
    onClick?: MouseEventHandler;
}

const week_Day = (week_number: number) =>{
    switch(week_number){
        case 1:
            return "Domingo";
        break;

        case 2:
            return "Segunda-Feira";
        break;

        case 3:
            return "Terça-Feira";
        break;

        case 4:
            return "Quarta-Feira";
        break;

        case 5:
            return "Quinta-Feira";
        break;

        case 6:
            return "Sexta-Feira";
        break;

        case 7:
            return "Sábado";
        break;

        default:
            return "Erro!";
        break;
    }
}

export const DailyCard = ({week_number, daily_theme, daily_food, onClick}:PropTypes) => {
    let titleCard = week_Day(week_number);
    return (
    <div className="structure-daily-card" onClick={onClick}>
        <div className="header-card">
            <h2>{titleCard}</h2>
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
}