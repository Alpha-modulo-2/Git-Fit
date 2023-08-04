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
        tasks: { description: string; _id: string }[];
    };
    mealsCard: {
        checked: boolean;
        meals: { description: string; ingredients: string[]; _id: string }[];
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

    const handleAddMealSubmit = async () => {
        if (newMealDescription.trim() === '') {
            return;
        }
        const newMeal = {
            description: newMealDescription,
            ingredients: [],
        };

        try {
            const response = await fetch(`http://localhost:3000/card/${currently_card?._id}/meal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMeal),
            });

            if (response.ok) {
                const updatedCardResponse = await fetch(`http://localhost:3000/allcards/${userId}`);
                const updatedData: CardData[] = await updatedCardResponse.json();
                const updatedCard = updatedData.find((card) => card.name === selectedDay?.name);

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
            const response = await fetch(`http://localhost:3000/card/${currently_card?._id}/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTraining),
            });
            if (response.ok) {
                const updatedCardResponse = await fetch(`http://localhost:3000/allcards/${userId}`);
                const updatedData: CardData[] = await updatedCardResponse.json();
                const updatedCard = updatedData.find((card) => card.name === selectedDay?.name);

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
            await fetch(`http://localhost:3000/card/${currently_card?._id}/task/${taskId}`, {
                method: 'DELETE',
            });

            const updatedCardResponse = await fetch(`http://localhost:3000/allcards/${userId}`);
            const updatedData: CardData[] = await updatedCardResponse.json();
            const updatedCard = updatedData.find((card) => card.name === selectedDay?.name);

            if (updatedCard) {
                setTrainingCard(updatedCard.trainingCard);
            }
        } catch (error) {
            console.error('Erro ao excluir treino', error);
        }
    };

    const handleDeleteMealClick = async (index: number) => {
        const mealId = mealsCard.meals[index]._id;

        try {
            await fetch(`http://localhost:3000/card/${currently_card?._id}/meal/${mealId}`, {
                method: 'DELETE',
            });

            const updatedCardResponse = await fetch(`http://localhost:3000/allcards/${userId}`);
            const updatedData: CardData[] = await updatedCardResponse.json();
            const updatedCard = updatedData.find((card) => card.name === selectedDay?.name);

            if (updatedCard) {
                setMealsCard(updatedCard.mealsCard);
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

    const [showEditButtons, setShowEditButtons] = useState(false);
    const [showEditMealButtons, setShowEditMealButtons] = useState(false);

    const [editingMealIndex, setEditingMealIndex] = useState<number>(-1);
    const [editingTaskIndex, setEditingTaskIndex] = useState<number>(-1);
    const [editedTaskDescription, setEditedTaskDescription] = useState('');
    const [editedMealDescription, setEditedMealDescription] = useState('');


    const handleEditCardTrainingSubmit = async () => {
        setIsEditingTraining(false);
        setShowEditButtons(false);

        const updatedTaskDescription = editedTaskDescription;
        const editingTaskId = trainingCard.tasks[editingTaskIndex]._id;
        console.log(editingTaskId)
        console.log(editingTaskIndex)
        try {
            await fetch(`http://localhost:3000/card/${currently_card?._id}/task/${editingTaskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: editingTaskId,
                    description: updatedTaskDescription,
                }),
            });

            const updatedCardResponse = await fetch(`http://localhost:3000/allcards/${userId}`);
            const updatedData: CardData[] = await updatedCardResponse.json();
            const updatedCard = updatedData.find((card) => card.name === selectedDay?.name);

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

        const updatedMealDescription = editedMealDescription; // Use o estado para obter o valor atualizado
        const editingMealId = mealsCard.meals[editingMealIndex]._id;

        try {
            await fetch(`http://localhost:3000/card/${currently_card?._id}/meal/${editingMealId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: editingMealId,
                    description: updatedMealDescription,
                }),
            });

            const updatedCardResponse = await fetch(`http://localhost:3000/allcards/${userId}`);
            const updatedData: CardData[] = await updatedCardResponse.json();
            const updatedCard = updatedData.find((card) => card.name === selectedDay?.name);

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