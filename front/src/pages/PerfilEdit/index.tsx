import "./editStyle.css";
import { Header } from "../../components/Header";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Form from "./formEdit";
import { useParams } from "react-router-dom";
import { Modal } from "../../components/Modal";
import { useAuth } from "../../context/authContext";
import { User } from "../../interfaces/IUser";
import uuid from 'uuidv4';

export interface ApiResponseRequests {
    error?: boolean;
    statusCode?: number;
    message?: string;
    user?: User;
}

export const PerfilEdit = () => {
    const { id } = useParams();
    const userId = id ?? "";

    const [nameValue, setNameValue] = useState("");
    const [updatedNameValue, setUpdatedNameValue] = useState("");

    const [userNameValue, setUserNameValue] = useState("");
    const [updatedUserNameValue, setUpdatedUserNameValue] = useState("");

    const [passwordValue, setPasswordValue] = useState("");
    const [updatedPasswordValue, setUpdatedPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [updatedEmailValue, setUpdatedEmailValue] = useState("");
    const [photoValue, setPhotoValue] = useState("");
    const [newPhotoValue, setNewPhotoValue] = useState<File>();
    const [genderValue, setGenderValue] = useState("");
    const [updatedGenderValue, setUpdatedGenderValue] = useState("");
    const [weightValue, setWeightValue] = useState("");
    const [updatedWeightValue, setUpdatedWeightValue] = useState("");
    const [heightValue, setHeightValue] = useState("");
    const [updatedHeightValue, setUpdatedHeightValue] = useState("");
    const [occupationValue, setOccupationValue] = useState("");
    const [updatedOccupationValue, setUpdatedOccupationValue] = useState("");
    const [ageValue, setAgeValue] = useState<number>(0);
    const [updatedAgeValue, setUpdatedAgeValue] = useState<number | undefined>();
    const [fileName, setFileName] = useState('')

    const { user, isLoggedIn, setLoggedUser } = useAuth();
    const { logout } = useAuth();

    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    const navigate: NavigateFunction = useNavigate();

    const urlPath = import.meta.env.VITE_URL_PATH || "";

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [messageModal, setMessageModal] = useState<string>("");

    useEffect(() => {
        if (user) {
            setNameValue(user.name || "");
            setUserNameValue(user.userName);
            setEmailValue(user.email);
            setPhotoValue(user.photo || '');
            setGenderValue(user.gender);
            setOccupationValue(user.occupation);
            setAgeValue(user.age || 0);
            const weightNumeric = user.weight.replace(/\D/g, "");
            const heightNumeric = user.height.replace(/\D/g, "");

            setWeightValue(weightNumeric);
            setHeightValue(heightNumeric);
        }
    }, [user]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const password = passwordValue;

        if (password !== confirmPasswordValue) {
            console.log("As senhas não coincidem.");
            setMessageModal("As senhas não coincidem.");
            openModal();
            return;
        }

        const formData = new FormData();

        // Adicione os campos ao FormData
        if (newPhotoValue !== null && newPhotoValue !== undefined) {
            formData.append("photo", newPhotoValue, fileName);
        }
        if (updatedAgeValue !== null && updatedAgeValue !== undefined) {
            formData.append("age", String(updatedAgeValue));
        }
        if (updatedNameValue !== null && updatedNameValue !== undefined && updatedNameValue !== '') {
            formData.append("name", updatedNameValue);
        }
        if (updatedUserNameValue !== null && updatedUserNameValue !== undefined && updatedUserNameValue !== '') {
            formData.append("userName", updatedUserNameValue);
        }
        if (updatedPasswordValue !== null && updatedPasswordValue !== undefined && updatedPasswordValue !== '') {
            formData.append("password", updatedPasswordValue);
        }
        if (updatedEmailValue !== null && updatedEmailValue !== undefined && updatedEmailValue !== '') {
            formData.append("email", updatedEmailValue);
        }
        if (updatedGenderValue !== null && updatedGenderValue !== undefined && updatedGenderValue !== '') {
            formData.append("gender", updatedGenderValue);
        }
        if (updatedWeightValue !== null && updatedWeightValue !== undefined && updatedWeightValue !== '') {
            formData.append("weight", `${updatedWeightValue}kg`);
        }
        if (updatedHeightValue !== null && updatedHeightValue !== undefined && updatedHeightValue !== '') {
            formData.append("height", `${updatedHeightValue}cm`);
        }
        if (updatedOccupationValue !== null && updatedOccupationValue !== undefined && updatedOccupationValue !== '') {
            formData.append("occupation", updatedOccupationValue);
        }

        try {
            const req = await fetch(`${urlPath}/users/${userId}`, {
                method: "PATCH",
                body: formData,
                credentials: 'include'
            })
            console.log('antes', req)
            if (req.ok) {
                console.log('meio',req)
                const result = await req.json()
                console.log(result)

                if (result.error == false && result.user !== undefined) {
                    setLoggedUser(result.user)
                    setMessageModal(`Usuário atualizado com sucesso!`);
                    openModal();
                    navigate("/profile")
                } else {
                    if (result.message !== undefined) {
                        setMessageModal(`Erro ao editar usuário: ${result.message}`);
                        openModal();
                    }
                }
            }
            else{
                const result = await req.json()
                setMessageModal(`Erro ao editar usuário: ${result.message}`);
                openModal();
            }
        } catch (err) {
            console.error("Error:", err);
            setMessageModal(`Erro: ${err as string}`);
            openModal();
        }

    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedNameValue(event.target.value);
        setNameValue(event.target.value);
    };
    const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUserNameValue(event.target.value);
        setUserNameValue(event.target.value);
    };
    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordValue(event.target.value);
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedPasswordValue(event.target.value);
        setPasswordValue(event.target.value);
    };
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedEmailValue(event.target.value);
        setEmailValue(event.target.value);
    };
    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const fileExtension = file.name.split('.').pop();
            if (fileExtension) {
                const fileName = `${uuid()}.${fileExtension}`; // Gera o nome de arquivo com UUID e extensão
                setFileName(fileName);
                setNewPhotoValue(file);
            }
        }
    };
    const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedWeightValue(`${event.target.value}kg`);
        setWeightValue(event.target.value);
    };
    const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedHeightValue(`${event.target.value}cm`);
        setHeightValue(event.target.value);
    };
    const handleOccupationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedOccupationValue(event.target.value);
        setOccupationValue(event.target.value);
    };
    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUpdatedGenderValue(event.target.value);
        setGenderValue(event.target.value);
    };
    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAgeValue = event.target.value;
        setUpdatedAgeValue(Number(newAgeValue));
        setAgeValue(Number(newAgeValue));
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Tem certeza de que deseja excluir sua conta?"
        );
        if (confirmed) {

            try {
                const req = await fetch(`${urlPath}/users/${userId}`, {
                    method: "DELETE",
                    credentials: 'include'
                })

                if (req.ok) {
                    setMessageModal("Usuário excluído com sucesso!");
                    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    logout();
                    navigate('/login');
                } else {
                    console.error("Erro ao excluir usuário:", req);
                    setMessageModal("Erro ao excluir usuário:");
                    openModal();
                }
            } catch (err) {
                console.error("Erro ao excluir usuário:", err);
                setMessageModal("Erro ao excluir usuário:");
                openModal();
            }
        }
    };

    return (
        <div className="Edit">
            <Header isLoggedIn={isLoggedIn} />
            <div className="All-content-edit">
                <div className="container-edit-content">
                    <Form
                        inputsUserNameValue={userNameValue}
                        inputsEmailValue={emailValue}
                        inputsAgeValue={ageValue}
                        inputsGenderValue={genderValue}
                        inputNameValue={nameValue}
                        inputsWeightValue={weightValue}
                        inputsHeightValue={heightValue}
                        inputsPasswordValue={passwordValue}
                        inputsOccupationValue={occupationValue}

                        onSubmit={handleSubmit}
                        inputsPhotoValue={photoValue}
                        handlePhotoChange={handlePhotoChange}
                        handleUserNameChange={handleUserNameChange}
                        handleEmailChange={handleEmailChange}
                        handleAgeChange={handleAgeChange}
                        handleGenderChange={handleGenderChange}
                        handleNameChange={handleNameChange}
                        handleWeightChange={handleWeightChange}
                        handleHeightChange={handleHeightChange}
                        handlePasswordChange={handlePasswordChange}
                        handleConfirmPasswordChange={handleConfirmPasswordChange}
                        handleOccupationChange={handleOccupationChange}
                        handleDeleteAccount={handleDeleteAccount}
                    />
                </div>
            </div>
            {modalIsOpen && <Modal children={messageModal} onClick={closeModal} />}
        </div>
    );
};
