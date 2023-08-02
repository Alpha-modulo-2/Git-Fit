/* eslint-disable react-hooks/exhaustive-deps */
import "./styles.css"
import { Header } from "../../components/Header";

import { useState, useEffect } from "react";
import ContactCard from "../../components/ContactCard";
import {Modal} from "../../components/Modal";
import { Chat } from "../../components/Chat";

interface FriendRequest {
    _id: string;
    requester: string;
    recipient: string;
    status: string;
    created_at: string;
    __v: number;
    requesterInfo?: User
  }
  
  interface ApiResponseRequests {
    error: boolean;
    statusCode: number;
    message?: string;
    friendRequests: FriendRequest[];
  }

  interface Friend {
    _id: string;
    userName: string;
    password: string;
    email: string;
    friends: Friend[]; // Array de IDs dos amigos (pode ser string[] ou Friend[])
    gender: string;
    weight: string;
    height: string;
    occupation: string;
    age: number;
    created_at: string;
    updated_at: string;
    __v: number;
  }
  
  interface User {
    _id: string;
    userName: string;
    password: string;
    email: string;
    friends: Friend[];
    gender: string;
    weight: string;
    height: string;
    occupation: string;
    age: number;
    created_at: string;
    updated_at: string;
    __v: number;
  }



export const Contacts = () => {
    const [contacts, setContacts] = useState<Friend[]>();
    const [requests, setRequests] = useState<FriendRequest[] | null>(null);
    const [showRequests, setShowRequests] = useState(false); // Estado para controlar exibição das solicitações
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [messageModal, setMessageModal] = useState<string>('');
    const [error, setError] = useState('');

    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }


    async function getContacts() {
        try {
            const userId= 	'64c9a35f4cfe8a8f5b6a4d49';
    
            const response = await fetch(`https://localhost:443/users/${userId}`);
            if (response.ok) {
                const data = await response.json() as User;
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


    async function getRequests() {
        try {
            const userId= 	'64c9a35f4cfe8a8f5b6a4d49';
                
            const response = await fetch(`https://localhost:443/friendRequests/${userId}`);
            if (response.ok) {
                const data = await response.json() as ApiResponseRequests;
                setRequests(data.friendRequests); 


                // getting information about every requester
                const requesterIds = data.friendRequests.map((request) => request.requester);
                const requesterDetails = await Promise.all(requesterIds.map((requesterId) => fetch(`https://localhost:443/users/${requesterId}`)));
                const requesterData = await Promise.all(requesterDetails.map((response) => response.json()));
                
                // updating friendRequests with the information accquired
                const updatedRequests:  FriendRequest[] = data.friendRequests.map((request, index) => ({
                    ...request,
                    requesterInfo: requesterData[index] as User, 
                    // Adding the users' info in 'requesterInfo' field
                }));
                
                setRequests(updatedRequests);
                
                console.log(updatedRequests)
            } else {
                console.error('Erro ao obter as solicitações');
                setError('Erro ao obter as solicitações.');
            }
        }catch (error) {
            console.error('Erro na requisição:', error);
            // setError('Erro na requisição');
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
    
    function updateFriends(requestId: string): void {
        try {
            console.log(requestId);
            fetch(`https://localhost:443/acceptFriend`, {
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
                return getRequests(); // Retornando a promessa da função getRequests
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                // Lidar com o erro aqui
            });
        } catch (error) {
            console.error('Erro geral:', error);
            // Lidar com o erro aqui
        }
    }
    function removeFriends(requestId: string): void {
        try {
            console.log(requestId);
            fetch(`https://localhost:443/rejectFriend/${requestId}`, {
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
                return getRequests(); // Retornando a promessa da função getRequests
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                // Lidar com o erro aqui
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
                <div className="search-box">
                    <input type="text" className="search-text" placeholder="Pesquisar"/>
                </div>
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
                    {showRequests ? requests?.map((requester) => (
                        <ContactCard
                            key={requester._id}
                            requesterInfo={requester.requesterInfo}
                            requestId={requester._id}
                            onUpdateFriends={updateFriends}
                            onRemoveFriends={removeFriends} 
                        // logica para remover contato
                        />
                    )) : contacts?.map((friend) => (
                        <ContactCard
                            key={friend._id}
                            requesterInfo={friend}
                            requestId={friend._id}
                            onAddFriend={(friend) => updateFriends(friend)}
                        />
                    ))}
                    </div>
                </div>
                {modalIsOpen && (
                    <Modal children={messageModal} onClick={closeModal} />
                )}
            </div>
        </div>
      
    );
  };
  