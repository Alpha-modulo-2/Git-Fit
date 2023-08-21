import "./styles.css"
import { useEffect, useState } from 'react';
import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleProgressBar } from "../../components/CircleProgressBar";
import { PhotoProfile } from "../../components/PhotoProfile";
import { useParams } from 'react-router-dom';
import { generalRequest } from "../../generalFunction";
import { User } from "../../interfaces/IUser.ts"
import { useAuth } from '../../context/authContext';
import { Modal } from "../../components/Modal";

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

    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    const convertToNumber = (stringValue: string) => {
        const numericValue = stringValue.replace(/\D/g, '');
        const numberValue = parseFloat(numericValue) / (stringValue.includes('cm') ? 100 : 1);
        return numberValue;
    };

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
        fetchUserData();
        fetchCardsData();
    }, []);

    let user_name = "";
    let weight = 0;
    let heigth = 0;
    let user_photo = "https://www.logolynx.com/images/logolynx/b4/b4ef8b89b08d503b37f526bca624c19a.jpeg";

    if (userData != null) {
        user_name = userData.userName;
        weight = convertToNumber(userData.weight);
        heigth = convertToNumber(userData.height);
        if (userData.photo) {
            user_photo = userData.photo;
        }
    }
    const calcIMC = Calc_IMC(weight, heigth);
    const progressIMC = (calcIMC.imc_media * 100) / 40;
    const progressIMCircle = parseInt(progressIMC.toFixed(0));

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

    const progress1 = parseInt(countMealCheckboxes().toFixed(0));
    const progress2 = parseInt(countTrainingCheckboxes().toFixed(0));

    return (
        <div className="profile">
            <Header isLoggedIn={true} />
            <div className="structure-contact-profile">
                <div className="container-contact-profile">
                    <div className="div-buttonAdd">
                        {!isFriend && (
                            <button className="buttonAdd" onClick={() => addFriends(user?._id, id)}>Adicionar ao Time</button>
                        )}
                    </div>
                    <PhotoProfile user_name={user_name} url_photo={`/uploads/${user_photo}`} />
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
                {modalIsOpen && (
                    <Modal children={messageModal} onClick={closeModal} />
                )}
            </div>
        </div>
    );
};
