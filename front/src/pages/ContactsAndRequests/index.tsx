import "./styles.css"
import { Header } from "../../components/Header";

import { useState } from "react";
import ContactCard from "../../components/ContactCard";
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
    const [error, setError] = useState('');

    
    
    
    const handleShowContacts = () => {
        console.log('caiu')
        getContacts().catch((error) => {
            console.error('Erro ao obter as solicitações:', error);
          });

        async function getContacts() {
            try {
                const userId= 	'64bd4cc8e86446a01cb52ee7';
    
                    
                const response = await fetch(`https://localhost:443/users/${userId}`);
                if (response.ok) {
                    const data = await response.json() as User;
                    setContacts(data.friends); 
    
                    console.log(data.friends, 'friendss')
                    return;
                } else {
                    console.error('Erro ao obter as solicitações');
                    console.log(error)
                    setError('Erro ao obter as solicitações.');
                }
            }catch (error) {
                console.error('Erro na requisição:', error);
                // setError('Erro na requisição');
            }
        }
        setShowRequests(false);
    };

    const handleShowRequests = () => {
        console.log('caiu')
        getRequests().catch((error) => {
            console.error('Erro ao obter as solicitações:', error);
          });

        async function getRequests() {
            try {
                const userId= 	'64bd4cc8e86446a01cb52ee7';
    
                    
                const response = await fetch(`https://localhost:443/friendRequests/${userId}`);
                if (response.ok) {
                    const data = await response.json() as ApiResponseRequests;
                    setRequests(data.friendRequests); 
    
                    // obtendo informações sobre cada requester
                    const requesterIds = data.friendRequests.map((request) => request.requester);
                    const requesterDetails = await Promise.all(requesterIds.map((requesterId) => fetch(`https://localhost:443/users/${requesterId}`)));
                    const requesterData = await Promise.all(requesterDetails.map((response) => response.json()));
                    
                    // atualizando os friendRequests com as informações obtidas
                    const updatedRequests:  FriendRequest[] = data.friendRequests.map((request, index) => ({
                        ...request,
                        requesterInfo: requesterData[index] as User, 
                        // Adicionandp as informações do usuário em um campo chamado 'requesterInfo'
                    }));
                    
                    setRequests(updatedRequests);
                    return;
                } else {
                    console.error('Erro ao obter as solicitações');
                    setError('Erro ao obter as solicitações.');
                }
            }catch (error) {
                console.error('Erro na requisição:', error);
                // setError('Erro na requisição');
            }
        }
        setShowRequests(true);
    };
    
    const updateFriends = (userId: string, friendId: string) => {
        console.log(userId, friendId)
        fetch(`/friends/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ friendId }),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Erro ao atualizar os contatos');
                // setError('Failed to update contacts.');
            }
        })
        .then((data) => {
            if (data) {
                //setContacts(data);
            }
        })
        .catch((error) => {
            console.error('Erro na requisição:', error);
            // setError('An error occurred while updating the contacts.');
        });
    };

   
    
      // useEffect com a função getContacts
//   useEffect(() => {
//     getRequests();
    
//   }, []);

  // Se você precisar que o useEffect seja executado apenas uma vez ao montar o componente,
    // deixe o segundo argumento do useEffect vazio (ou seja, uma array vazia []).
    // Se precisar que o useEffect seja executado toda vez que uma dependência mudar,
    // coloque a dependência dentro da array (por exemplo, [contacts]).

    // const navigate: NavigateFunction = useNavigate();
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
                        <p className={`title-contacts title-content-left ${!showRequests ? 'active' : ''}`} onClick={handleShowContacts}
                        >Contatos</p>
                        <p className={`title-contacts title-content-right ${showRequests ? 'active' : ''}`} onClick={handleShowRequests}             
                        >Solicitações</p>
                    </div>
                    <p className="contacts-line"></p>

                    {/* div dos cards */}
                    <div className="container-contact-cards">
                    {showRequests ? requests?.map((requester) => (
                        <ContactCard
                        key={requester._id}
                        requesterInfo={requester.requesterInfo}
                        onAddClick={(userId, friendId) => updateFriends(userId, friendId)}
                        onRemoveClick={(userId) => console.log(userId)
                        } 
                        // logica para remover contato
                        />
                    )) : contacts?.map((friend) => (
                        <ContactCard
                        key={friend._id}
                        requesterInfo={friend}
                        onAddClick={(userId, friendId) => updateFriends(userId, friendId)}
                        onRemoveClick={undefined}
                        />
                    ))}
                    </div>
                </div>
                
            </div>
        </div>
      
    );
  };
  