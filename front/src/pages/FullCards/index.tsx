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
import { generalRequest } from "../../generalFunction";
import { PencilSimple, X } from "@phosphor-icons/react";


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

interface Task {
    _id: string;
    description: string;
}

interface Meal {
    _id: string;
    description: string;
}

interface CardDataTest {
    card: {
        trainingCard: {
            checked: boolean;
            title: string;
            tasks: Task[];
        };
        mealsCard: {
            checked: boolean;
            meals: Meal[];
        };
        _id: string;
        userId: string;
        name: string;
        created_at: string;
        updated_at: string;
        __v: number;
    }[];
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

    const [currently_card, set_currently_card_id] = useState<CardDataTest['card'][0] | undefined>();

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const response = await generalRequest(`/allcards/${userId}`) as CardDataTest;
                const data = response;
                const currentCard = data.card.find((card) => card.name === selectedDay?.name);
                if (currentCard) {
                    setTrainingCard(currentCard.trainingCard);
                    setMealsCard(currentCard.mealsCard);
                    set_currently_card_id(currentCard);
                }
            } catch (error) {
                console.error('Erro ao buscar dados dos cards', error);
            }
        };
        fetchCardsData().catch(error => {
            console.error('Erro ao buscar dados dos cards', error);
        });
    }, [selectedId]);

    const handleTrainingCheckboxChange = async () => {
        const updatedTrainingCard = {
            ...trainingCard,
            checked: !trainingCard.checked,
        };
        setTrainingCard(updatedTrainingCard);
        try {
            await generalRequest('/trainingCard/check', {
                cardId: currently_card?._id,
                checked: updatedTrainingCard.checked,
            }, 'PATCH');
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
            await generalRequest('/mealsCard/check', {
                cardId: currently_card?._id,
                checked: updatedMealsCard.checked,
            }, 'PATCH');
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
            await generalRequest(`/card/${currently_card?._id}/meal`, newMeal, 'POST');
            const updatedCardResponse = await generalRequest(`/allcards/${userId}`) as CardDataTest;
            const updatedData = updatedCardResponse;
            const updatedCard = updatedData.card.find((card) => card.name === selectedDay?.name);
            if (updatedCard) {
                setMealsCard(updatedCard.mealsCard);
                setDataChanged(!dataChanged);
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
            const response = await generalRequest(`/card/${currently_card?._id}/task`, newTraining, 'POST')
            if (response) {
                const updatedCardResponse = await generalRequest(`/allcards/${userId}`) as CardDataTest;
                const updatedData = updatedCardResponse;
                const updatedCard = updatedData.card.find((card) => card.name === selectedDay?.name);

                if (updatedCard) {
                    setTrainingCard(updatedCard.trainingCard);
                    setDataChanged(!dataChanged);
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
        setEditingTaskIndex(index);
    };


    const handleEditMealClick = (index: number) => {
        const description = mealsCard.meals[index].description;
        setEditedMealDescription(description);
        setIsEditingMeal(true);
        setEditingMealIndex(index);
    };

    const handleDeleteTrainingClick = async (index: number) => {
        const taskId = trainingCard.tasks[index]._id;

        try {
            await generalRequest(`/task/${taskId}`, {}, 'DELETE');

            const updatedCardResponse = await generalRequest(`/allcards/${userId}`) as CardDataTest;
            const updatedData = updatedCardResponse;
            const updatedCard = updatedData.card.find((card) => card.name === selectedDay?.name);
            if (updatedCard) {
                setTrainingCard(updatedCard.trainingCard);
                setDataChanged(!dataChanged);
            }
        } catch (error) {
            console.error('Erro ao excluir treino', error);
        }
    };

    const handleDeleteMealClick = async (index: number) => {
        const mealId = mealsCard.meals[index]._id;

        try {
            await generalRequest(`/meal/${mealId}`, {}, 'DELETE')
            
            const updatedCardResponse = await generalRequest(`/allcards/${userId}`) as CardDataTest;
            const updatedData = updatedCardResponse;
            const updatedCard = updatedData.card.find((card) => card.name === selectedDay?.name);
            if (updatedCard) {
                setMealsCard(updatedCard.mealsCard);
                setDataChanged(!dataChanged);
            }
            
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



    const [showMiniCarrosel, setShowMiniCarrossel] = useState(true);

    const [editingMealIndex, setEditingMealIndex] = useState<number>(-1);
    const [editingTaskIndex, setEditingTaskIndex] = useState<number>(-1);
    const [editedTaskDescription, setEditedTaskDescription] = useState('');
    const [editedMealDescription, setEditedMealDescription] = useState('');


    const handleEditCardTrainingSubmit = async () => {
        setIsEditingTraining(false);
        const updatedTaskDescription = editedTaskDescription;
        const editingTaskId = trainingCard.tasks[editingTaskIndex]._id;
        try {
            await generalRequest(`/updateTask`, {
                taskId: editingTaskId,
                description: updatedTaskDescription,
            }, 'PATCH');

            const updatedCardResponse = await generalRequest(`/allcards/${userId}`) as CardDataTest;
            const updatedData = updatedCardResponse;
            const updatedCard = updatedData.card.find((card) => card.name === selectedDay?.name);
            if (updatedCard) {
                setTrainingCard(updatedCard.trainingCard);
                setEditedTaskDescription('');
                updateDailyCards();
            }
        } catch (error) {
            console.error('Erro ao atualizar a tarefa', error);
        }
    };

    const handleEditCardMealSubmit = async () => {
        setIsEditingMeal(false);

        const updatedMealDescription = editedMealDescription;
        const editingMealId = mealsCard.meals[editingMealIndex]._id;

        try {
            await generalRequest(`/updateMeal`, {
                mealId: editingMealId,
                description: updatedMealDescription,
            }, 'PATCH');

            const updatedCardResponse = await generalRequest(`/allcards/${userId}`) as CardDataTest;
            const updatedData = updatedCardResponse;
            const updatedCard = updatedData.card.find((card) => card.name === selectedDay?.name);
            if (updatedCard) {
                setMealsCard(updatedCard.mealsCard);
                updateDailyCards();
            }
        } catch (error) {
            console.error('Erro ao atualizar a refeição', error);
        }
    };
    
    const changeversion = () => {
        if (showMiniCarrosel) {
            setShowMiniCarrossel(false);
        } else {
            setShowMiniCarrossel(true);
        }
    }
    const [isChatOpen, setIsChatOpen] = useState(false);
    const handleChatToggle = (isOpen: boolean) => {
        setIsChatOpen(isOpen);
    };

    
    const [isHoveringTraining, setIsHoveringTraining] = useState(false);
    const [isHoveringMeal, setIsHoveringMeal] = useState(false);

    const [dataChanged, setDataChanged] = useState(false);

    const updateDailyCards = () => {
        setDataChanged(!dataChanged);
    };

    return (
        <div className="fullcard">
            <Header isLoggedIn={true} />
            <div className="structure-fullcard">
                {isChatOpen ? (
                    <div className="message_box">
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                ) : (
                    <div className="buttoncarrossel" onClick={changeversion}>
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                )}
                <div className="background-card">
                    <h2>{selectedDay?.name}</h2>
                    <div className="div_training_card">
                        <div className="title_training_card">
                            <h3>Treino:</h3>
                        </div>
                        <div className="body_training_card">
                            <h3>{trainingCard.title}</h3>
                            {trainingCard.tasks.length === 0 ? (
                                <p>Nenhum treino adicionado</p>
                            ) : (
                                <>
                                    <ul>
                                        {trainingCard.tasks.map((option, index) => (
                                            <li key={index} className="task_line"
                                            onMouseEnter={() => setIsHoveringTraining(true)}
                                            onMouseLeave={() => setIsHoveringTraining(false)}>
                                                <p>{option.description}</p>
                                                {isHoveringTraining && (
                                                    <div className="edit_buttons">
                                                        <PencilSimple
                                                            size={16}
                                                            color="white"
                                                            className="icons-edit-card"
                                                            onClick={() => handleEditTrainingClick(index)}
                                                        />
                                                        <X
                                                            size={16}
                                                            color="white"
                                                            className="icons-edit-card"
                                                            onClick={() => handleDeleteTrainingClick(index)}
                                                        />                          
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
                        </div>
                        <div className="body_meal_card">
                            {mealsCard.meals.length === 0 ? (
                                <p>Nenhuma refeição adicionada</p>
                            ) : (
                                <>
                                    {mealsCard.meals.map((mealOption, index) => (
                                        <div key={index} className={`ul_meal_0${index + 1}`}>
                                            <div className="meal_line"
                                                onMouseEnter={() => setIsHoveringMeal(true)}
                                                onMouseLeave={() => setIsHoveringMeal(false)}>
                                                <h3>{mealOption.description}</h3>
                                                {isHoveringMeal && (
                                                    <div className="edit_buttons">
                                                        <PencilSimple
                                                            size={16}
                                                            color="white"
                                                            className="icons-edit-card"
                                                            onClick={() => handleEditMealClick(index)}
                                                        />
                                                        <X
                                                            size={16}
                                                            color="white"
                                                            className="icons-edit-card"
                                                            onClick={() => handleDeleteMealClick(index)}
                                                        />       
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
                {(isChatOpen || window.screen.width < 900) ? (
                        <div className="structure-minicarrossel">
                            <MiniCard week_number={0} onClick={() => navigate('/fullcard/0')}></MiniCard>
                            <MiniCard week_number={1} onClick={() => navigate('/fullcard/1')}></MiniCard>
                            <MiniCard week_number={2} onClick={() => navigate('/fullcard/2')}></MiniCard>
                            <MiniCard week_number={3} onClick={() => navigate('/fullcard/3')}></MiniCard>
                            <MiniCard week_number={4} onClick={() => navigate('/fullcard/4')}></MiniCard>
                            <MiniCard week_number={5} onClick={() => navigate('/fullcard/5')}></MiniCard>
                            <MiniCard week_number={6} onClick={() => navigate('/fullcard/6')}></MiniCard>
                        </div>
                ) : (
                    <div className="structure-carrossel-fc">
                        <DailyCard week_number={0} dataChanged={dataChanged} onClick={() => navigate('/fullcard/0')}></DailyCard>
                        <DailyCard week_number={1} dataChanged={dataChanged} onClick={() => navigate('/fullcard/1')}></DailyCard>
                        <DailyCard week_number={2} dataChanged={dataChanged} onClick={() => navigate('/fullcard/2')}></DailyCard>
                        <DailyCard week_number={3} dataChanged={dataChanged} onClick={() => navigate('/fullcard/3')}></DailyCard>
                        <DailyCard week_number={4} dataChanged={dataChanged} onClick={() => navigate('/fullcard/4')}></DailyCard>
                        <DailyCard week_number={5} dataChanged={dataChanged} onClick={() => navigate('/fullcard/5')}></DailyCard>
                        <DailyCard week_number={6} dataChanged={dataChanged} onClick={() => navigate('/fullcard/6')}></DailyCard>
                    </div>
                )}
        </div>
        </div>
    );
};