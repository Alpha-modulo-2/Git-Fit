import "./styles.css"
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleProgressBar } from "../../components/CircleProgressBar";
import { PhotoProfile } from "../../components/PhotoProfile";
import { Chat } from "../../components/Chat";
import { Modal } from "../../components/Modal";
import { ContactDailyCard } from "../../components/ContactDailyCard/index.tsx";
import { MiniCard } from "../../components/MiniCard/index.tsx";
import ApexChart from "../../components/Chart";
import { UserSummaryResponse, Summary } from "../../interfaces/IUserSummaryResponse"; 

import { generalRequest } from "../../generalFunction";
import { User } from "../../interfaces/IUser.ts"
import { useAuth } from '../../context/authContext';

import { DotsThreeVertical } from "@phosphor-icons/react";

interface Task {
    _id: string;
    description: string;
}

interface Meal {
    _id: string;
    description: string;
}
interface Card {
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

interface ApiResponseRequests {
    error?: boolean;
    statusCode?: number;
    message?: string;
    user?: User;
}

export const Contact_profile: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    if (user == undefined) {
        throw new Error("Usuário é undefined");
    }

    if (id == undefined) {
        throw new Error("Id não definido");
    }
    const [userData, setUserData] = useState<User | null>(null);
    const [cardData, setCardData] = useState<any[]>([]);
    const [isFriend, setisFriend] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [messageModal, setMessageModal] = useState<string>('');
    const [summary, setSummary] = useState<Summary>({
        dates: [],
        tasks: [],
        meals: [],
        weight: []
    });
    const [showMiniCarrosel, setShowMiniCarrossel] = useState(true);

    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await generalRequest(`/users/${id}`);
                setUserData(response as User);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário', error);
            }
        };

        const fetchCardsData = async () => {
            try {
                const response = await generalRequest(`/allcards/${id}`) as Card
                const data = response.card
                setCardData(data);
            } catch (error) {
                console.error('Erro ao buscar dados dos cards', error);
            }
        };
        fetchUserData().catch(()=>{
            console.error("Erro ao obter seus dados")
        });
        fetchCardsData().catch(()=>{
            console.error("Erro ao obter os cards")
        });
    }, []);

    let user_name = "";
    let user_photo = "https://www.logolynx.com/images/logolynx/b4/b4ef8b89b08d503b37f526bca624c19a.jpeg";

    if (userData != null) {
        user_name = userData.userName;
        if (userData.photo) {
            user_photo = userData.photo;
        }
    }

    //-------------------------
    const countTrainingCheckboxes = () => {
        const totalDays = cardData.length;
        const checkedDays = cardData.filter((day) => day.trainingCard.checked).length;
        return (checkedDays / totalDays) * 100;
    };

    // Função para contar a quantidade de checkboxes marcados para alimentação
    const countMealCheckboxes = () => {
        const totalDays = cardData.length;
        const checkedDays = cardData.filter((day) => day.mealsCard.checked).length;
        return (checkedDays / totalDays) * 100;
    };

    function checkFriendButton() {
        if (userData) {
            const checkFriend: boolean = userData.friends.some(friend => friend._id === user?._id);
            setisFriend(checkFriend)
        }
    }

    useEffect(() => {
        checkFriendButton()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData])

    function addFriends(requesterId: string, recipientId: string): void {
        const response = generalRequest('/solicitation', { requesterId, recipientId }, 'POST') as Promise<ApiResponseRequests>;
        response
            .then(data => {
                if (data.message) {
                    setMessageModal(data.message)
                    openModal();
                }
            }
            ).catch(error => {
                console.error('Erro na requisição:', error);
            });
    }

    function removeFriend(userId: string, friendId: string): void {
        const response = generalRequest(`/user/${userId}/friend/${friendId}`, undefined , 'DELETE');
        response.then(response => {
        if (response && typeof response === 'object' && 'status' in response) {
        if (response.status === 204) {
            setMessageModal("Amigo removido com sucesso!")
            openModal();
            setisFriend(false);
        } else {
            setMessageModal("Erro ao remover amizade")
            openModal()
        }
        } else {
        setMessageModal("Não foi possível remover a amizade")
        openModal()
        }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    }
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



    const [isMiniCarrossel, setIsMiniCarrossel] = useState(false);
    const handleMiniCarrossel = (isOpen: boolean) => {
        console.log('caiu', isMiniCarrossel)
        setIsMiniCarrossel(isOpen)
    };
    
    const progress1 = parseInt(countMealCheckboxes().toFixed(0));
    const progress2 = parseInt(countTrainingCheckboxes().toFixed(0));

    useEffect(() => {
        const fetchUserSummary = async () => {
            try {
                const response = await generalRequest(`/userSummary/${id}`) as UserSummaryResponse
                const data = response
                if (data !== undefined) {
                    const newSummary: Summary = {
                        dates: [],
                        tasks: [],
                        meals: [],
                        weight: []
                    };

                    data.userSummary.forEach(userSummary => {
                        const date = new Date(userSummary.date);
                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        const trainingPercentage = Math.round((userSummary.checks.trainingCard / 7) * 100);
                        const mealPercentage = Math.round((userSummary.checks.mealsCard / 7) * 100);

                        newSummary.dates.push(formattedDate);
                        newSummary.tasks.push(trainingPercentage);
                        newSummary.meals.push(mealPercentage);
                        newSummary.weight.push(parseFloat(userSummary.weight));
                    });

                    setSummary(newSummary)
                }
            } catch (error) {
                console.error('Erro ao buscar summary do usuário', error);
            }
        };
        fetchUserSummary().catch(error => {
            console.error('Erro ao buscar summary do usuário', error);
        });
    }, [userData]);

    return (
        <div className="profile">
            <Header isLoggedIn={true} />
            <div className={`structure-contact-profile ${!isFriend ? "centered" : ""} `}>
                {isChatOpen ? (
                    <div className="message_box">
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                ) : (
                    <div className="buttoncarrossel" onClick={changeversion}>
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                )}
                <div className="container-contact-profile">
                    <div className="div-buttonAdd">
                        {!isFriend ? (
                            <button className="buttonAdd" onClick={ () => addFriends(user?._id, id)}>Adicionar contato</button>
                        ): (
                            <button className="buttonAdd" onClick={ () => removeFriend(user?._id, id)}>Remover contato</button>
                        )}
                    </div>
                    <div className={`${summary.dates.length > 2 && user?.occupation && isFriend ? "container-photo-bars" : "align-centered"}`}>
                        <PhotoProfile user_name={user_name} url_photo={user_photo} />
                        <div className="container-profile-progress-bar">
                            <div className="div-profile-progress-bar">
                                <ProgressBar progress={progress1} title_bar="Alimentação" />
                                <CircleProgressBar progress={progress1} title_bar={""} />
                            </div >
                            <div className="div-profile-progress-bar">
                                <ProgressBar progress={progress2} title_bar="Exercícios" />
                                <CircleProgressBar progress={progress2} title_bar={""} />
                            </div>
                        </div>
                    </div>
                    {
                        summary.dates.length > 2 && user?.occupation && isFriend &&
                        <ApexChart summary={summary} />
                    }
                </div>
                {isFriend ? (
                    (!isChatOpen || isMiniCarrossel) ? (
                        <div className="structure-carrossel-fc">
                            <div className="container-icon-change-cards">
                                <DotsThreeVertical
                                    size={35}
                                    color="white"
                                    className="icon-change-cards"
                                    onClick={()=> handleMiniCarrossel(!isMiniCarrossel)}
                                />
                            </div>

                            <ContactDailyCard week_number={0} dataChanged={false} contactId={id}></ContactDailyCard>
                            <ContactDailyCard week_number={1} dataChanged={false} contactId={id}></ContactDailyCard>
                            <ContactDailyCard week_number={2} dataChanged={false} contactId={id}></ContactDailyCard>
                            <ContactDailyCard week_number={3} dataChanged={false} contactId={id}></ContactDailyCard>
                            <ContactDailyCard week_number={4} dataChanged={false} contactId={id}></ContactDailyCard>
                            <ContactDailyCard week_number={5} dataChanged={false} contactId={id}></ContactDailyCard>
                            <ContactDailyCard week_number={6} dataChanged={false} contactId={id}></ContactDailyCard>
                        </div>
                    ) : (
                        <div className="structure-minicarrossel">
                            <div className="container-icon-change-cards">
                                <DotsThreeVertical
                                    size={35}
                                    color="white"
                                    className="icon-change-cards"
                                    onClick={()=> handleMiniCarrossel(!isMiniCarrossel)}
                                />
                            </div>
                            <MiniCard week_number={0}></MiniCard>
                            <MiniCard week_number={1}></MiniCard>
                            <MiniCard week_number={2}></MiniCard>
                            <MiniCard week_number={3}></MiniCard>
                            <MiniCard week_number={4}></MiniCard>
                            <MiniCard week_number={5}></MiniCard>
                            <MiniCard week_number={6}></MiniCard>
                        </div>
                    )
                ): (
                    <div></div>
                )}
                
                {modalIsOpen && (
                    <Modal children={messageModal} onClick={closeModal} />
                )}
            </div>
        </div>
    );
};
