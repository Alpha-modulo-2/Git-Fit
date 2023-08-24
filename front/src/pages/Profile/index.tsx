import "./styles.css"
import { useEffect, useState } from 'react';
import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleProgressBar } from "../../components/CircleProgressBar";
import { PhotoProfile } from "../../components/PhotoProfile";
import { DailyCard } from "../../components/DailyCard";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { generalRequest } from "../../generalFunction";
import { Chat } from "../../components/Chat";
import { MiniCard } from "../../components/MiniCard";
import ApexChart from "../../components/Chart";

const convertToNumber = (stringValue: string) => {
    const numericValue = stringValue ? stringValue.replace(/\D/g, '') : '';
    const numberValue = parseFloat(numericValue) / (stringValue && stringValue.includes('cm') ? 100 : 1);
    return numberValue;
};
interface Task {
    _id: string;
    description: string;
}

interface Meal {
    _id: string;
    description: string;
}

export interface ApiResponseRequests {
    error?: boolean;
    statusCode?: number;
    message?: string;
    card?: CardData[];
}
interface CardData {
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

interface History {
    dates: string[];
    tasks: number[];
    meals: number[];
    weight: number[];
}

interface Props {
    history: History;
}

/* const Calc_IMC = (weight_imc: number, height_imc: number) => {
    const imc = weight_imc / (height_imc * height_imc);
    const imc_obj = {
        imc_media: imc,
        imc_class: "",
        imc_color: "#00ff3c"
    }
    if (imc < 18.5) {
        imc_obj.imc_class = "IMC: Abaixo";
    }
    if (imc >= 18.5 && imc < 25) {
        imc_obj.imc_class = "IMC: Normal";
    }
    if (imc >= 25 && imc < 30) {
        imc_obj.imc_class = "IMC: Sobrepeso";
    }
    if (imc >= 30) {
        imc_obj.imc_class = "IMC: Obesidade";
    }
    return (imc_obj);
}
 */

export const Profile = () => {
    const navigate: NavigateFunction = useNavigate();

    const { user } = useAuth();
    const userId = String(user?._id);

    const [cardData, setCardData] = useState<any[]>([]);
    const [showMiniCarrosel, setShowMiniCarrossel] = useState(true);

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const response = await generalRequest(`/allcards/${userId}`) as ApiResponseRequests
                const data = response.card
                if (data !== undefined) {
                    setCardData(data);
                }
            } catch (error) {
                console.error('Erro ao buscar dados dos cards', error);
            }
        };
        fetchCardsData().catch(error => {
            console.error('Erro ao buscar dados dos cards', error);
        });
    }, [userId]);

    let user_name = "";
    let weight = 0;
    let heigth = 0;
    let user_photo = new URL("../../assets/images/placeholderphoto.jpg", import.meta.url).href

    if (user != null) {
        user_name = user.userName;
        weight = convertToNumber(user.weight);
        heigth = convertToNumber(user.height);
        if (user.photo) {
            user_photo = `/uploads/${user.photo}`;
        }
    }

    const countTrainingCheckboxes = () => {
        const totalDays = cardData.length;
        const checkedDays = cardData.filter((day) => day.trainingCard.checked).length;

        return totalDays > 0 ? (checkedDays / totalDays) * 100 : 0;
    };

    const countMealCheckboxes = () => {
        const totalDays = cardData.length;
        const checkedDays = cardData.filter((day) => day.mealsCard.checked).length;

        return totalDays > 0 ? (checkedDays / totalDays) * 100 : 0;
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

    const progress1 = parseInt(countMealCheckboxes().toFixed(0));
    const progress2 = parseInt(countTrainingCheckboxes().toFixed(0));

    const history = {
        dates: ["2023-06-04", "2023-06-04", "2023-06-04"],
        tasks: [45, 44, 42, 45],
        meals: [70],
        weight: [120]
    };

    return (
        <div className="profile">
            <Header isLoggedIn={true} />
            <div className="structure-profile">
                {isChatOpen ? (
                    <div className="message_box">
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                ) : (
                    <div className="buttoncarrossel" onClick={changeversion}>
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                )}
                <div className="container-profile">
                    <div className={`${history.dates.length <= 2 ? "align-centered": "container-photo-bars"}`}>
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
                        history.dates.length > 2 &&
                        <ApexChart history={history} />
                    }
                </div>
                {!isChatOpen ? (
                    <div className="structure-carrossel-fc">
                        <DailyCard week_number={0} dataChanged={false} onClick={() => navigate('/fullcard/0')}></DailyCard>
                        <DailyCard week_number={1} dataChanged={false} onClick={() => navigate('/fullcard/1')}></DailyCard>
                        <DailyCard week_number={2} dataChanged={false} onClick={() => navigate('/fullcard/2')}></DailyCard>
                        <DailyCard week_number={3} dataChanged={false} onClick={() => navigate('/fullcard/3')}></DailyCard>
                        <DailyCard week_number={4} dataChanged={false} onClick={() => navigate('/fullcard/4')}></DailyCard>
                        <DailyCard week_number={5} dataChanged={false} onClick={() => navigate('/fullcard/5')}></DailyCard>
                        <DailyCard week_number={6} dataChanged={false} onClick={() => navigate('/fullcard/6')}></DailyCard>
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
