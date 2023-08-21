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

const Calc_IMC = (weight_imc: number, height_imc: number) => {
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


export const Profile = () => {
    const navigate: NavigateFunction = useNavigate();

    const { user } = useAuth();
    const userId = String(user?._id);

    const [cardData, setCardData] = useState<any[]>([]);

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
    const calcIMC = Calc_IMC(weight, heigth);
    const progressIMC = (calcIMC.imc_media * 100) / 40;
    const progressIMCircle = parseInt(progressIMC.toFixed(0));

    const countTrainingCheckboxes = () => {
        const totalDays = cardData.length;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const checkedDays = Array.isArray(cardData) ? cardData.filter((day) => day.trainingCard.checked).length : 0;
        if (isNaN(checkedDays)) {
            return 0;
        } else {
            return (checkedDays / totalDays) * 100;
        }
    };

    const countMealCheckboxes = () => {
        const totalDays = cardData.length;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const checkedDays = Array.isArray(cardData) ? cardData.filter((day) => day.mealsCard.checked).length : 0;
        if (isNaN(checkedDays)) {
            return 0;
        } else {
            return (checkedDays / totalDays) * 100;
        }
    };

    const progress1 = parseInt(countMealCheckboxes().toFixed(0));
    const progress2 = parseInt(countTrainingCheckboxes().toFixed(0));

    return (
        <div className="profile">
            <Header isLoggedIn={true} />
            <div className="structure-profile">
                <div className="container-profile">
                    <PhotoProfile user_name={user_name} url_photo={user_photo} />
                    <div className="container-progress-bar">
                        <div className="div-progress-bar">
                            <ProgressBar progress={progress1} title_bar="Alimentação" />
                            <CircleProgressBar progress={progress1} title_bar={""} />
                        </div >
                        <div className="div-progress-bar">
                            <ProgressBar progress={progress2} title_bar="Exercícios" />
                            <CircleProgressBar progress={progress2} title_bar={""} />
                        </div>
                        <div className="div-progress-bar">
                            <ProgressBar progress={progressIMC} title_bar={calcIMC.imc_class} />
                            <CircleProgressBar progress={progressIMCircle} title_bar={calcIMC.imc_media.toFixed(1)} />
                        </div>
                    </div>
                </div>
                <div className="structure-carrossel-fc">
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
