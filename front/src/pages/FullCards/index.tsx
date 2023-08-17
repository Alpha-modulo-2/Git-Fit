import "./styles.css";
import { useState, useEffect } from 'react';
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { DailyCard } from "../../components/DailyCard";
import { MiniCard } from "../../components/MiniCard";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Chat } from "../../components/Chat";
//import currentuser from '../../currentuser.json'

interface CardData {
    card: [{}]
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
    userId: string;
    name: string;
    created_at: string;
    updated_at: string;
    __v: number;
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

    const { user } = useAuth();
    // const { isLoggedIn, login, user } = useAuth();
    // console.log(isLoggedIn, login, user, 'login');
    const userId = String(user?._id);

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

    const urlPath = process.env.URL_PATH;

    if (!urlPath) {
    throw new Error('URL_PATH is not defined');
    }

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const response = await fetch(`${urlPath}/allcards/${userId}`);
                const data = await response.json();

                const currentCard = data.card.find((card: CardData) => card.name === selectedDay?.name);

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
            await fetch(`${urlPath}/trainingCard/check`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardId: currently_card?._id,
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
            await fetch(`${urlPath}/mealsCard/check`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardId: currently_card?._id,
                    checked: updatedMealsCard.checked,
                }),
            });
        } catch (error) {
            console.error('Erro ao atualizar o checkbox das refeições', error);
        }
    };

    const handleAddMealSubmit = async () => {
        if (newMealDescription.trim() === '') {
            return;
        }
        const newMeal = {
            description: newMealDescription,
            ingredients: [],
        };

        try {
            const response = await fetch(`${urlPath}/card/${currently_card?._id}/meal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMeal),
            });

            if (response.ok) {
                const updatedCardResponse = await fetch(`${urlPath}/allcards/${userId}`);
                const updatedData: any = await updatedCardResponse.json();
                const updatedCard = updatedData.card.find((card: CardData) => card.name === selectedDay?.name);
                if (updatedCard) {
                    setMealsCard(updatedCard.mealsCard);
                }
            } else {
                console.error('Erro ao adicionar nova refeição', response);
            }
        } catch (error) {
            console.error('Erro ao adicionar nova refeição', error);
        }

        setNewMealDescription('');
        setIsAddMeal(false);
    };

    const handleAddTrainingSubmit = async () => {
        if (newTrainingDescription.trim() === '') {
            return;
        }
        const newTraining = {
            description: newTrainingDescription,
        };
        try {
            const response = await fetch(`${urlPath}/card/${currently_card?._id}/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTraining),
            });
            if (response.ok) {
                const updatedCardResponse = await fetch(`${urlPath}/allcards/${userId}`);
                const updatedData: any = await updatedCardResponse.json();
                const updatedCard = updatedData.card.find((card: CardData) => card.name === selectedDay?.name);

                if (updatedCard) {
                    setTrainingCard(updatedCard.trainingCard);
                }
            } else {
                console.error('Erro ao adicionar nova tarefa', response);
            }
        } catch (error) {
            console.error('Erro ao adicionar novo treino', error);
        }
        setNewTrainingDescription('');
        setIsAddTraining(false);
    };
    const handleEditTrainingClick = (index: number) => {
        const description = trainingCard.tasks[index].description;
        setEditedTaskDescription(description);
        setIsEditingTraining(true);
        setShowEditButtons(true);
        setEditingTaskIndex(index);
    };


    const handleEditMealClick = (index: number) => {
        const description = mealsCard.meals[index].description;
        setEditedMealDescription(description);
        setIsEditingMeal(true);
        setShowEditMealButtons(true);
        setEditingMealIndex(index);
    };

    const handleDeleteTrainingClick = async (index: number) => {
        const taskId = trainingCard.tasks[index]._id;

        try {
            await fetch(`${urlPath}/task/${taskId}`, {
                method: 'DELETE',
            });

            const updatedCardResponse = await fetch(`${urlPath}/allcards/${userId}`);
            const updatedData: any = await updatedCardResponse.json();
            const updatedCard = updatedData.card.find((card: CardData) => card.name === selectedDay?.name);
            setTrainingCard(updatedCard.trainingCard);
        } catch (error) {
            console.error('Erro ao excluir treino', error);
        }
    };

    const handleDeleteMealClick = async (index: number) => {
        const mealId = mealsCard.meals[index]._id;

        try {
            await fetch(`${urlPath}/meal/${mealId}`, {
                method: 'DELETE',
            });

            const updatedCardResponse = await fetch(`${urlPath}/allcards/${userId}`);
            const updatedData: any = await updatedCardResponse.json();
            const updatedCard = updatedData.card.find((card: CardData) => card.name === selectedDay?.name);
            setMealsCard(updatedCard.mealsCard);

        } catch (error) {
            console.error('Erro ao excluir refeição', error);
        }
    };

    const [isEditingTraining, setIsEditingTraining] = useState(false);
    const [isEditingMeal, setIsEditingMeal] = useState(false);
    const [isAddTraining, setIsAddTraining] = useState(false);
    const [isAddMeal, setIsAddMeal] = useState(false);

    const [newMealDescription, setNewMealDescription] = useState('');
    const [newTrainingDescription, setNewTrainingDescription] = useState('');

    const [showEditButtons, setShowEditButtons] = useState(false);
    const [showEditMealButtons, setShowEditMealButtons] = useState(false);

    const [showMiniCarrosel, setShowMiniCarrossel] = useState(true);

    const [editingMealIndex, setEditingMealIndex] = useState<number>(-1);
    const [editingTaskIndex, setEditingTaskIndex] = useState<number>(-1);
    const [editedTaskDescription, setEditedTaskDescription] = useState('');
    const [editedMealDescription, setEditedMealDescription] = useState('');


    const handleEditCardTrainingSubmit = async () => {
        setIsEditingTraining(false);
        setShowEditButtons(false);

        const updatedTaskDescription = editedTaskDescription;
        const editingTaskId = trainingCard.tasks[editingTaskIndex]._id;
        try {
            await fetch(`${urlPath}/updateTask`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId: editingTaskId,
                    description: updatedTaskDescription,
                }),
            });

            const updatedCardResponse = await fetch(`${urlPath}/allcards/${userId}`);
            const updatedData: any = await updatedCardResponse.json();
            const updatedCard = updatedData.card.find((card: CardData) => card.name === selectedDay?.name);

            if (updatedCard) {
                setTrainingCard(updatedCard.trainingCard);
            }
        } catch (error) {
            console.error('Erro ao atualizar a tarefa', error);
        }
    };

    const handleEditCardMealSubmit = async () => {
        setIsEditingMeal(false);
        setShowEditMealButtons(false);

        const updatedMealDescription = editedMealDescription;
        const editingMealId = mealsCard.meals[editingMealIndex]._id;

        try {
            await fetch(`${urlPath}/updateMeal`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mealId: editingMealId,
                    description: updatedMealDescription,
                }),
            });

            const updatedCardResponse = await fetch(`${urlPath}/allcards/${userId}`);
            const updatedData: any = await updatedCardResponse.json();
            const updatedCard = updatedData.card.find((card: CardData) => card.name === selectedDay?.name);

            if (updatedCard) {
                setMealsCard(updatedCard.mealsCard);
            }
        } catch (error) {
            console.error('Erro ao atualizar a refeição', error);
        }
    };

    const EditCardTraining = () => {
        setIsEditingTraining(true);
        setShowEditButtons(true);
    };

    const EditCardMeal = () => {
        setIsEditingMeal(true);
        setShowEditMealButtons(true)
    };

    const changeversion = () => {
        if (showMiniCarrosel) {
            setShowMiniCarrossel(false);
        } else {
            setShowMiniCarrossel(true);
        }
    }

    return (
        <div className="fullcard">
            <Header isLoggedIn={true} />
            <div className="structure-fullcard">
                {!showMiniCarrosel ? (
                    <div className="message_box">
                        <input type="button" className="buttoncarrossel" onClick={changeversion}></input>
                        <Chat></Chat>
                    </div>
                ) : (
                    <input type="button" className="buttoncarrossel" onClick={changeversion}></input>
                )}
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
                                            <li key={index} className="task_line">
                                                <p>{option.description}</p>
                                                {isEditingTraining && showEditButtons && (
                                                    <div className="edit_buttons">
                                                        <Button category="edit_cards" label="E" onClick={() => handleEditTrainingClick(index)} />
                                                        <Button category="edit_cards" label="X" onClick={() => handleDeleteTrainingClick(index)} />
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                        </div>
                        {isEditingTraining ? (
                            <div className="edit_form_training">
                                <input
                                    type="text"
                                    value={editedTaskDescription}
                                    onChange={(e) => setEditedTaskDescription(e.target.value)}
                                />
                                <Button category="primary" label="Concluir" onClick={handleEditCardTrainingSubmit} />
                            </div>
                        ) : isAddTraining ? (
                            <div className="edit_form_training">
                                <input
                                    type="text"
                                    value={newTrainingDescription}
                                    onChange={(e) => setNewTrainingDescription(e.target.value)}
                                />
                                <Button category="primary" label="Concluir" onClick={handleAddTrainingSubmit} />
                            </div>
                        ) : (
                            <div className="daily_training_check">
                                <Button category="primary" label="Adicionar Exercício" onClick={() => setIsAddTraining(true)} />
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
                                <>
                                    {mealsCard.meals.map((mealOption, index) => (
                                        <div key={index} className={`ul_meal_0${index + 1}`}>
                                            <div className="meal_line">
                                                <h3>{mealOption.description}</h3>
                                                {isEditingMeal && showEditMealButtons && (
                                                    <div className="edit_buttons">
                                                        <Button category="edit_cards" label="E" onClick={() => handleEditMealClick(index)} />
                                                        <Button category="edit_cards" label="X" onClick={() => handleDeleteMealClick(index)} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                        </div>


                        {isEditingMeal ? (
                            <div className="edit_form_meal">
                                <input
                                    type="text"
                                    value={editedMealDescription}
                                    onChange={(e) => setEditedMealDescription(e.target.value)}
                                />
                                <Button category="primary" label="Concluir" onClick={handleEditCardMealSubmit} />
                            </div>
                        ) : isAddMeal ? (
                            <div className="edit_form_meal">
                                <input
                                    type="text"
                                    value={newMealDescription}
                                    onChange={(e) => setNewMealDescription(e.target.value)}
                                />
                                <Button category="primary" label="Adicionar" onClick={handleAddMealSubmit} />
                            </div>
                        ) : (
                            <div className="daily_meal_check">
                                <Button
                                    category="primary"
                                    label="Adicionar Refeição"
                                    onClick={() => setIsAddMeal(true)}
                                />
                                <input
                                    type="checkbox"
                                    className="daily_meal_checkbox"
                                    checked={mealsCard.checked}
                                    onChange={handleMealCheckboxChange}
                                />
                                <p>{mealsCard.checked}</p>
                            </div>
                        )}
                    </div>
                </div>
                {showMiniCarrosel ? (
                    <div className="structure-carrossel">
                        <DailyCard week_number={0} onClick={() => navigate('/fullcard/0')}></DailyCard>
                        <DailyCard week_number={1} onClick={() => navigate('/fullcard/1')}></DailyCard>
                        <DailyCard week_number={2} onClick={() => navigate('/fullcard/2')}></DailyCard>
                        <DailyCard week_number={3} onClick={() => navigate('/fullcard/3')}></DailyCard>
                        <DailyCard week_number={4} onClick={() => navigate('/fullcard/4')}></DailyCard>
                        <DailyCard week_number={5} onClick={() => navigate('/fullcard/5')}></DailyCard>
                        <DailyCard week_number={6} onClick={() => navigate('/fullcard/6')}></DailyCard>
                    </div>
                ) : (
                    <div className="structure-minicarrossel">
                        <MiniCard week_number={0} onClick={() => navigate('/fullcard/0')}></MiniCard>
                        <MiniCard week_number={1} onClick={() => navigate('/fullcard/1')}></MiniCard>
                        <MiniCard week_number={2} onClick={() => navigate('/fullcard/2')}></MiniCard>
                        <MiniCard week_number={3} onClick={() => navigate('/fullcard/3')}></MiniCard>
                        <MiniCard week_number={4} onClick={() => navigate('/fullcard/4')}></MiniCard>
                        <MiniCard week_number={5} onClick={() => navigate('/fullcard/5')}></MiniCard>
                        <MiniCard week_number={6} onClick={() => navigate('/fullcard/6')}></MiniCard>
                    </div>
                )}
            </div>
        </div>
    );
};