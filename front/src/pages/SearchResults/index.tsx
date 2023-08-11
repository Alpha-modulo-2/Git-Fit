/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect, ReactElement } from "react";

import { Header } from "../../components/Header";
import ContactCard from "../../components/ContactCard";
import {Modal} from "../../components/Modal";
import { Chat } from "../../components/Chat";

import "./styles.css"
import { SearchedUsersContext } from "../../context/searchedUsersContext";
import { useAuth } from '../../context/authContext';

// import  { UserFriendRequests } from '../ContactsAndRequests/getUserRequests';
import { UserData } from "../../interfaces/IUser";

interface FriendRequest {
    _id: string;
    requester: UserData;
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
    const [userFriendRequests, setUserFriendRequests] = useState<FriendRequest[] | null | undefined>()
    const [error, setError] = useState('');

    const searchedUsersContext = useContext(SearchedUsersContext);
    const { user } = useAuth();

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


    /***************    GET USER FRIEND REQUESTS     ********************/
    async function getRequests() {
        if(user){
            try {                    
                const response = await fetch(`http://localhost:3000/friendRequests/${user?.id}`);
                if (response.ok) {
                    const data = await response.json() as ApiResponseRequests;
                    setUserFriendRequests(data.friendRequests); 
                    console.log(data.friendRequests, 'requestsinSearch')
                } else {
                    console.error('Erro ao obter as solicitações');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }
    }
    useEffect(() => {
        getRequests().catch((error) => {
            console.error('Erro ao obter as solicitações:', error);
        });

    }, [user]);
    

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
    // function checkAFriend(){
    //     if(usersFromSearch && user){
    //         const filteredUsers = usersFromSearch.filter(userSearched =>
    //             userSearched.friends.some(friend => friend._id === user.id)
    //         );
    //         console.log(filteredUsers, 'filteredUsers')
    //         return filteredUsers
    //     }
    // }


    /***************    GET USER FRIEND REQUESTS     ********************/
    
    // function getUserRequests() {
    //     if(user){
    //         const friendRequests = useFriendRequests(user?.id);
    //         // return friendRequests;
    //         setUserFriendRequests(friendRequests)
    //     }
        
    //     // Agora você pode usar a array de friendRequests em seu componente
      
    // } 
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
                }
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
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
        } catch (error) {
            console.error('Erro geral:', error);
        }
    }
           
    function getCardType(userSearched: UserData): ReactElement{
        const isFriend = userSearched.friends.some(friend => friend._id === user?.id);

        // const isRequested = userFriendRequests?.some(request => request.requester._id === userSearched._id);
        // console.log(userFriendRequests?.find(request => request.requester._id === userSearched._id), '2 condição')
        const requestedFriend = userFriendRequests?.find(request => {
            return request.requester._id === userSearched._id;
        });
        console.log("requestedFriend:", requestedFriend);
        
        

        if (isFriend) {
            return (
                <ContactCard
                    key={userSearched._id}
                    requesterInfo={userSearched}
                    recipientId={userSearched._id}
                    typeOfCard={'contact'}
                />
            );
        }else if
         (requestedFriend) {
            
            return (
                <ContactCard
                    key={userSearched._id}
                    requesterInfo={userSearched}
                    requestId={requestedFriend._id}
                    onUpdateFriends={updateFriends}
                    onRemoveFriends={removeFriends}
                    typeOfCard={'request'}
                />
            )
        } else if (userSearched._id === user?.id) {
            return  (<></>)
        } else {
            return (
                <ContactCard
                    key={userSearched._id}
                    requesterInfo={userSearched}
                    requestId={user?.id}
                    recipientId={userSearched._id}
                    onAddFriend={addFriends}
                    typeOfCard={'addUser'}
                />
            );
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
                            getCardType(userSearched)
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
  