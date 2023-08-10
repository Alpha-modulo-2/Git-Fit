/* eslint-disable react-hooks/exhaustive-deps */
import "./styles.css"
import { Header } from "../../components/Header";

import { useState, useContext, useEffect } from "react";
import ContactCard from "../../components/ContactCard";
import {Modal} from "../../components/Modal";
import { Chat } from "../../components/Chat";
import { SearchedUsersContext } from "../../context/searchedUsersContext";
import { useAuth } from '../../context/authContext';
import { UserData } from "../../interfaces/IUser";

interface FriendRequest {
    _id: string;
    requester: string;
    recipient: string;
    created_at: string;
    __v: number;
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
    const [usersFromSearch, setUsersFromSearch] = useState<UserData[] | undefined>([]);
    const [error, setError] = useState('');

    const searchedUsersContext = useContext(SearchedUsersContext);
    const { user } = useAuth();

    useEffect(() => {
        if(searchedUsersContext){
            setUsersFromSearch(searchedUsersContext.usersFromSearch)
            console.log(usersFromSearch,'paginaresultado')
            checkAFriend()
            console.log(user, 'user')
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
    function checkAFriend(){
        if(usersFromSearch && user){
            const filteredUsers = usersFromSearch.filter(userSearched =>
                userSearched.friends.some(friend => friend._id === user.id)
            );
            console.log(filteredUsers, 'filteredUsers')
            return filteredUsers
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
                    {usersFromSearch?.map((userSearched) => (
                        <ContactCard
                            key={userSearched._id}
                            requesterInfo={userSearched}
                            requestId={user?.id}
                            recipientId={userSearched._id}
                            onAddFriend={addFriends}
                            typeOfCard={
                                'addUser'    
                            }
                        />
                    ))}
                    {checkAFriend()?.map((userFriend) => (
                        <ContactCard
                            key={userFriend._id}
                            requesterInfo={userFriend}
                            recipientId={userFriend._id}
                            typeOfCard={
                                'contact'    
                            }
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
  