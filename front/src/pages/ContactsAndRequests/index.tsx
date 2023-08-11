/* eslint-disable react-hooks/exhaustive-deps */
import "./styles.css"
import { Header } from "../../components/Header";

import { useState, useEffect } from "react";
import ContactCard from "../../components/ContactCard";
import {Modal} from "../../components/Modal";
import { Chat } from "../../components/Chat";
import { useAuth } from '../../context/authContext';
import { UserData } from '../../interfaces/IUser';
import { Friend } from '../../interfaces/IUser';
import { FriendRequest } from '../../interfaces/IContacts';
import { ApiResponseRequests } from '../../interfaces/IContacts';


export const Contacts = () => {
    const [contacts, setContacts] = useState<Friend[]>();
    const [requests, setRequests] = useState<FriendRequest[] | null>(null);
    const [showRequests, setShowRequests] = useState(false); // Estado para controlar exibição das solicitações
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [messageModal, setMessageModal] = useState<string>('');
    const [error, setError] = useState('');
    

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
        console.log(user, 'login')
        if(user){
            try {
                const id = String(user.id)
                const response = await fetch(`http://localhost:3000/users/${id}`);
                if (response.ok) {
                    const data = await response.json() as UserData;
                    setContacts(data.friends); 
    
                    console.log(data, 'contatct')
                    return;
                } else {
                    setError('Erro ao obter os contatos.');
                    console.error('Erro ao obter os contatos', error);
    
                }
            }catch (error) {
                console.error('Erro na requisição:', error);
                // setError('Erro na requisição');
            }
                
        }
    }


    /***************    GET THE FRIEND REQUESTS    ********************/
    async function getRequests() {
        if(user){
            try {                    
                const response = await fetch(`http://localhost:3000/friendRequests/${user.id}`);
                if (response.ok) {
                    const data = await response.json() as ApiResponseRequests;
    
                    setRequests(data.friendRequests); 
                    console.log(data.friendRequests, 'requests')  
                } else {
                    console.error('Erro ao obter as solicitações');
                    setError('Erro ao obter as solicitações.');
                }
            }catch (error) {
                console.error('Erro na requisição:', error);
                // setError('Erro na requisição');
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
        try {
            console.log(requestId);
            fetch(`http://localhost:3000/acceptFriend`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId }),
            }).then(response => {
                if (response.ok) {
                    return response.json() as Promise<ApiResponseRequests>;
                } else {
                    setError('Erro ao obter as solicitações.');
                    throw new Error('Failed to update contacts.');
                }
            }).then(data => {
                console.log(data.message);
                if(data.message){
                    setMessageModal(data.message)
                    openModal()
                    return getContacts();
                }
            }).then(() => {
                return getRequests(); 
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
        } catch (error) {
            console.error('Erro geral:', error)
        }
    }


    /***************    REFUSE A FRIEND REQUEST     ********************/
    function removeFriends(requestId: string): void {
        try {
            console.log(requestId);
            fetch(`http://localhost:3000/rejectFriend/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.ok) {
                    return response.json() as Promise<ApiResponseRequests>;
                } else {
                    setError('Erro ao obter as solicitações.');
                    throw new Error('Failed to update contacts.');
                }
            }).then(data => {
                console.log(data, 'data');
                if(data.message){
                    setMessageModal(data.message)
                    openModal()
                    return getContacts();
                }
            }).then(() => {
                return getRequests();
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
        } catch (error) {
            console.error('Erro geral:', error);
        }
    }
     
    return (
        <div className="contacts-page">
            <Header isLoggedIn={true}/>
            <div className="container-contacts-request">
                <Chat/>
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
  