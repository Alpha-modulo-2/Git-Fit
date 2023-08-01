import "./styles.css";
import { useState, useEffect } from 'react';
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { DailyCard } from "../../components/DailyCard";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import currentuser from '../../currentuser.json'

interface CardData {
    _id: string;
    trainingCard: {
        checked: boolean;
        title: string;
        tasks: { description: string }[];
    };
    mealsCard: {
        checked: boolean;
        meals: { description: string; ingredients: string[] }[];
    };
    name: string;
}

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
    const navigate = useNavigate();
    const { id } = useParams();
    const selectedId = id ?? "1";
    const selectedDay = weekDays.find(day => day.id === parseInt(selectedId));
    let userId = currentuser.id;
    const [trainingCard, setTrainingCard] = useState<CardData['trainingCard']>({
        checked: false,
        title: '',
        tasks: [],
    });

    const [mealsCard, setMealsCard] = useState<CardData['mealsCard']>({
        checked: false,
        meals: [],
    });

    const [currently_card, set_currently_card_id] = useState<CardData | undefined>();

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/allcards/${userId}`);
                const data: CardData[] = await response.json();
                const currentCard = data.find((card) => card.name === selectedDay?.name);
                console.log(currentCard);
                if (currentCard) {
                    setTrainingCard(currentCard.trainingCard);
                    setMealsCard(currentCard.mealsCard);
                    set_currently_card_id(currentCard);
                }
            } catch (error) {
                console.error('Erro ao buscar dados dos cards', error);
            }
        };
        fetchCardsData();
    }, [selectedId]);

    const handleTrainingCheckboxChange = async () => {
        const updatedTrainingCard = {
            ...trainingCard,
            checked: !trainingCard.checked,
        };
        setTrainingCard(updatedTrainingCard);

        try {
            await fetch(`http://localhost:3000/card/${currently_card?._id}/trainingCard/check`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    checked: updatedTrainingCard.checked,
                }),
            });
        } catch (error) {
            console.error('Erro ao atualizar o checkbox do treino', error);
        }
    };

    const handleMealCheckboxChange = async () => {
        const updatedMealsCard = {
            ...mealsCard,
            checked: !mealsCard.checked,
        };
        setMealsCard(updatedMealsCard);

        try {
            await fetch(`http://localhost:3000/card/${currently_card?._id}/mealsCard/check`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    checked: updatedMealsCard.checked,
                }),
            });
        } catch (error) {
            console.error('Erro ao atualizar o checkbox das refeições', error);
        }
    };

    const [isEditingTraining, setIsEditingTraining] = useState(false);
    const [isEditingMeal, setIsEditingMeal] = useState(false);

    const handleEditCardTrainingSubmit = () => {
        setIsEditingTraining(false);
    };
    const EditCardTraining = () => {
        setIsEditingTraining(true);
    };
    const handleEditCardMealSubmit = () => {
        setIsEditingMeal(false);
    };
    const EditCardMeal = () => {
        setIsEditingMeal(true);
    };

    return (
        <div className="fullcard">
            <Header isLoggedIn={true} />
            <div className="structure-fullcard">
                <div className="background-card">
                    <h2>{selectedDay?.name}</h2>
                    <div className="div_training_card">
                        <div className="title_training_card">
                            <h3>Treino:</h3>
                            <Button category="primary" label="Editar Card" onClick={EditCardTraining} />
                        </div>
                        <div className="body_training_card">
                            <h3>{trainingCard.title}</h3>
                            {trainingCard.tasks.length === 0 ? (
                                <p>Nenhum treino adicionado</p>
                            ) : (
                                <>
                                    <ul>
                                        {trainingCard.tasks.map((option, index) => (
                                            <li key={index}>{option.description}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        {isEditingTraining ? (
                            <div className="edit_form_training">
                                <input
                                    type="text"
                                    value={trainingCard.title}
                                    onChange={(e) => setTrainingCard({ ...trainingCard, title: e.target.value })}
                                />
                                <Button category="primary" label="Concluir" onClick={handleEditCardTrainingSubmit} />
                            </div>
                        ) : (
                            <div className="daily_training_check">
                                <input
                                    type="checkbox"
                                    className="daily_training_checkbox"
                                    checked={trainingCard.checked}
                                    onChange={handleTrainingCheckboxChange}
                                />
                            </div>)}
                    </div>
                    <div className="div_meal_card">
                        <div className="title_meal_card">
                            <h3>Refeições:</h3>
                            <Button category="primary" label="Editar Card" onClick={EditCardMeal} />
                        </div>
                        <div className="body_meal_card">
                            {mealsCard.meals.length === 0 ? (
                                <p>Nenhuma refeição adicionada</p>
                            ) : (
                                mealsCard.meals.map((mealOption, index) => (
                                    <div key={index} className={`ul_meal_0${index + 1}`}>
                                        <h3>{mealOption.description}</h3>
                                        <ul>
                                            {mealOption.ingredients.map((ingredient, i) => (
                                                <li key={i}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </div>
                        {isEditingMeal ? (
                            <div className="edit_form_meal">
                                <input
                                    type="text"
                                />
                                <Button category="primary" label="Concluir" onClick={handleEditCardMealSubmit} />
                            </div>
                        ) : (
                        <div className="daily_meal_check">
                            <input
                                type="checkbox"
                                className="daily_meal_checkbox"
                                checked={mealsCard.checked}
                                onChange={handleMealCheckboxChange}
                            />
                            <p>{mealsCard.checked}</p>
                        </div>)}
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

