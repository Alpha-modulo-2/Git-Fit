/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ReactElement } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Header } from "../../components/Header";
import ContactCard from "../../components/ContactCard";
import {Modal} from "../../components/Modal";
import { Chat } from "../../components/Chat";

import "./styles.css"
import { useAuth } from '../../context/authContext';
import { generalRequest } from "../../generalFunction";

// import  { UserFriendRequests } from '../ContactsAndRequests/getUserRequests';
import { UserData } from "../../interfaces/IUser";
import { Friend } from '../../interfaces/IUser';

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
    const [query, setQuery]=useState('')
    
    const { user } = useAuth();

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
            const response = await generalRequest(`/friendRequests/${user._id}`) as ApiResponseRequests;
            if(response){
                setUserFriendRequests(response.friendRequests); 
            }
            if(response.error){
                console.error('Erro ao obter as solicitações');
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
        const response = generalRequest('/solicitation', {requesterId, recipientId}, 'POST') as Promise<ApiResponseRequests> ;
        response
        .then(data => {
            if(data.message){
                setMessageModal(data.message)
                openModal();   
        }}
        ).catch(error => {
            console.error('Erro na requisição:', error);
        });
    }

    /***************    ACCEPT A FRIEND REQUEST     ********************/
    function updateFriends(requestId: string, requesterId?: string): void {
        const response = generalRequest('/acceptFriend', {requestId}, 'PATCH') as Promise<ApiResponseRequests> ;
        response
        .then(data => {
            if(data.message){
                setMessageModal(data.message)
                openModal();  
                addUserAsFriend(requesterId);
            }}).catch(error => {
                console.error('Erro na requisição:', error);
        });
      
    }

    /***************    REFUSE A FRIEND REQUEST     ********************/
    function removeFriends(requestId: string): void {
        const response = generalRequest(`/rejectFriend/${requestId}`, {requestId}, 'DELETE') as Promise<ApiResponseRequests>;
        response
        .then(data => {
            if(data.message){
                setMessageModal(data.message)
                openModal()
                getRequests().catch(() => {console.log('Não foi possível obter as solicitações')})
            }
        }).catch(error => {
            console.error('Erro na requisição:', error);
        });
    }

    /***************    GET USERS FROM SEARCH    ********************/
    async function searchUsers() {
        const response = await generalRequest<UserData[]>(`/users/search?name=${query}`)
        if(response){
            if(response.length === 0){
                setMessageModal('Não foi encontrado nenhum usuário na pesquisa')
                openModal();
            }else{
                setUsersFromSearch(response)
            }
        }
    }

    /***************    ADD USER AS FRIEND    ********************/
  function addUserAsFriend(requesterId: string | undefined){
    const updatedUsers = usersFromSearch?.map((userSearched) => {
        if (userSearched._id === requesterId) {
            const updatedFriends: Friend[] = [
                ...userSearched.friends,
                {
                    _id: user?._id || '',
                    occupation: user?.occupation || '',
                    photo: user?.photo || '',
                    userName: user?.userName || '',
                },
            ];

            return {
                ...userSearched,
                friends: updatedFriends,
            };
        }
        return userSearched;
    });

    if (updatedUsers) {
        setUsersFromSearch(updatedUsers);
    }
  }
        
    /***************    GET TYPE OF CARD    ********************/
    function getCardType(userSearched: UserData): ReactElement{
        const isFriend = userSearched.friends.some(friend => friend._id === user?._id);

        const requestedFriend = userFriendRequests?.find(request => {
            return request.requester._id === userSearched._id;
        });       

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
        } else if (userSearched._id === user?._id) {
            return  (<></>)
        } else {
            return (
                <ContactCard
                    key={userSearched._id}
                    requesterInfo={userSearched}
                    requestId={user?._id}
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
                <Chat onChatOpen={false}/>
                <div className="search-box">
                    <input type="text" className="search-text" placeholder="Pesquisar usuários..."
                    onChange={(e)=> setQuery(e.target.value)}/>
                    
                    <button onClick={()=> searchUsers()} type="button" className="icon-search-btn">
                        <MagnifyingGlass
                        size={20}
                        weight="bold"
                        color="#3d3d3d"
                        className="icon-search"
                        />
                    </button>
                </div>
                {usersFromSearch && usersFromSearch.length > 0 &&(
                    <div className="container-search-results">
                        {/* div dos cards */}
                        <div className="search-results">
                        {usersFromSearch?.map((userSearched) => (
                            getCardType(userSearched)
                        ))}
                        </div>
                    </div>
                )}
                {modalIsOpen && (
                    <Modal children={messageModal} onClick={closeModal} />
                )}
            </div>
        </div>
      
    );
  };
  