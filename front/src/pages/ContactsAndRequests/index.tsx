/* eslint-disable react-hooks/exhaustive-deps */
import "./styles.css"
import { Header } from "../../components/Header";

import { useState, useEffect } from "react";
import ContactCard from "../../components/ContactCard";
import {Modal} from "../../components/Modal";
import { useAuth } from '../../context/authContext';
import { User } from '../../interfaces/IUser';
import { Friend } from '../../interfaces/IUser';
import { FriendRequest } from '../../interfaces/IContacts';
import { ApiResponseRequests } from '../../interfaces/IContacts';
import { generalRequest } from "../../generalFunction";
import { Chat } from "../../components/Chat";

export const Contacts = () => {
    const [contacts, setContacts] = useState<Friend[]>();
    const [requests, setRequests] = useState<FriendRequest[] | null>(null);
    const [showRequests, setShowRequests] = useState(false); // Estado para controlar exibição das solicitações
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [messageModal, setMessageModal] = useState<string>('');
    
    const { user } = useAuth();
    /***************    MODAL    ********************/
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }
    

    /***************    GET USER'S FRIENDS    ********************/
    async function getContacts() {
        if(user){
            const id = String(user._id)
            const response = await generalRequest(`/users/${id}`) as User;
            if(response){
                setContacts(response.friends)
            }
            if(typeof response !== "object"){
                setMessageModal('Você não tem contatos')
                openModal();
            }
        }
    }


    /***************    GET THE FRIEND REQUESTS    ********************/
    async function getRequests() {
        if(user){
            const response = await generalRequest(`/friendRequests/${user._id}`) as ApiResponseRequests;
            if(response){
                setRequests(response.friendRequests)
            }
            if(response.error){
                setRequests([])
            }
        }
    }
        
    useEffect(() => {
        getContacts().catch((error) => {
            console.error('Erro ao obter as solicitações:', error);
        });

        getRequests().catch((error) => {
            console.error('Erro ao obter as solicitações:', error);
        });
    }, []);

    
    /***************    ACCEPT A FRIEND REQUEST     ********************/
    function updateFriends(requestId: string): void {
        const response = generalRequest('/acceptFriend', {requestId}, 'PATCH') as Promise<ApiResponseRequests> ;
        response
        .then(data => {
            if(data.message){
                setMessageModal(data.message)
                openModal();   
                return getContacts()
        }}).then(() =>{return getRequests()}
        ).catch(error => {
            console.error('Erro na requisição:', error);
        });
    }


    /***************    REFUSE A FRIEND REQUEST     ********************/
    function removeFriends(requestId: string): void {
        const response = generalRequest(`/rejectFriend/${requestId}`, {requestId}, 'DELETE') as Promise<ApiResponseRequests> ;
        response
        .then(data => {
            if(data.message){
                setMessageModal(data.message)
                openModal();   
                return getContacts()
        }}).then(() => {return getRequests()}
        ).catch(error => {
            console.error('Erro na requisição:', error);
        });
    }
    
const [isChatOpen, setIsChatOpen] = useState(false);
const handleChatToggle = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
};

    return (
        <div className="contacts-page">
            <Header isLoggedIn={true}/>
            <div className="container-contacts-request">
                {isChatOpen ? (
                    <div className="message_box">
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                ) : (
                    <div className="buttoncarrossel">
                        <Chat onChatOpen={handleChatToggle}></Chat>
                    </div>
                )}
                <div className="content-contacts">
                    <div className="container-titles-contacts">
                        <p className={`title-contacts title-content-left ${!showRequests ? 'active' : ''}`} onClick={() => setShowRequests(false)}
                        >Contatos</p>
                        <p className={`title-contacts title-content-right ${showRequests ? 'active' : ''}`} onClick={() => setShowRequests(true)}
                        >Solicitações</p>
                    </div>
                    <p className="contacts-line"></p>

                    {/* div dos cards */}
                    <div className="container-contact-cards">
                        {(
                            showRequests ? (
                                requests?.map((requester) => (
                                    <ContactCard
                                        key={requester._id}
                                        requesterInfo={requester.requester}
                                        requestId={requester._id}
                                        onUpdateFriends={updateFriends}
                                        onRemoveFriends={removeFriends}
                                        typeOfCard="request" 
                                    />
                                ))
                            ) : (
                                contacts?.map((friend) => (
                                    <ContactCard
                                        key={friend._id}
                                        requesterInfo={friend}
                                        recipientId={friend._id}
                                        typeOfCard="contact" 
                                    />
                                ))
                            )
                        )}
                    </div>

                </div>
                {modalIsOpen && (
                    <Modal children={messageModal} onClick={closeModal} />
                )}
            </div>
        </div>
    );
};
