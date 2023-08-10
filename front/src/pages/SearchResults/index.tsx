/* eslint-disable react-hooks/exhaustive-deps */
import "./styles.css"
import { Header } from "../../components/Header";

import { useState, useContext, useEffect } from "react";
import ContactCard from "../../components/ContactCard";
import {Modal} from "../../components/Modal";
import { Chat } from "../../components/Chat";
import { SearchedUsersContext } from "../../context/searchedUsersContext";
import { User } from "../../interfaces/IUser";

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

export const SearchedResults = () => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [messageModal, setMessageModal] = useState<string>('');
    const [usersFromSearch, setUsersFromSearch] = useState<User[] | undefined>([]);
    const [error, setError] = useState('');

    const searchedUsersContext = useContext(SearchedUsersContext);

    useEffect(() => {
        if(searchedUsersContext){
            setUsersFromSearch(searchedUsersContext.usersFromSearch)
            console.log(usersFromSearch,'paginaresultado')
        }
    }, [usersFromSearch, searchedUsersContext]);
    

    /***************    MODAL    ********************/
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }    

    /***************    MAKE A FRIEND REQUEST     ********************/
    function addFriends(requesterId: string, recipientId: string): void {
        try {
            console.log(requesterId);
            console.log(usersFromSearch, 'usersfromsearch')
            fetch(`http://localhost:3000/solicitation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requesterId, recipientId }),
            }).then(response => {
                if (response.ok) {
                    return response.json() as Promise<ApiResponseRequests>;
                } else {
                    setError('Erro ao adicionar amizade.');
                    console.error(error)
                    throw new Error('Failed to update contacts.');
                }
            }).then(data => {
                console.log(data.message);
                if(data.message){
                    setMessageModal(data.message)
                    openModal()
                }
            }).catch(error => {
                console.error('Erro na requisição:', error);
                // Lidar com o erro aqui
            });
        } catch (error) {
            console.error('Erro geral:', error);
            // Lidar com o erro aqui
        }
    }

    return (
        <div className="search-page">
            <Header isLoggedIn={true} />
            <div className="container-search">
                <Chat/>

                <div className="container-search-results">
                    {/* div dos cards */}
                    <div className="search-results">
                        {usersFromSearch !== null && usersFromSearch && usersFromSearch.length > 0 ? (
                            usersFromSearch.map((user) => (
                                <ContactCard
                                    key={user.id}
                                    requesterInfo={user}
                                    requestId={'64c9a35f4cfe8a8f5b6a4d49'}
                                    recipientId={user.id}
                                    onAddFriend={addFriends} 
                                />
                            ))
                        ) : (
                            <div></div>
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
  