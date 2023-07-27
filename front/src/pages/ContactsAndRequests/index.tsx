import "./styles.css"
import { Header } from "../../components/Header";

import { UserCirclePlus, XCircle, Check } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import ContactCard from "../../components/ContactCard";
import { Chat } from "../../components/Chat";

interface ContactsProps{
    photo: string;
    name: string;
    occupation: string;
    id: string;
}

interface AddFriendResponse {
    error: boolean;
    statusCode: number;
    message: string;
}

export const Contacts = () => {
    const [contacts, setContacts] = useState<ContactsProps[]>();
    const [requests, setRequests] = useState<ContactsProps[]>([]);
    const [showRequests, setShowRequests] = useState(false); // Estado para controlar exibição das solicitações
    const [error, setError] = useState('');

    const getContacts =  () => {
        try {
            const users: ContactsProps[] = [
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'João da Silva',
                occupation: 'Engenheiro',
                id: '1'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Maria Oliveira',
                occupation: 'Médica',
                id: '2'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Pedro Santos',
                occupation: 'Advogado',
                id: '3'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Ana Souza',
                occupation: 'Professor',
                id: '4'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Lucas Lima',
                occupation: 'Estudante',
                id: '5'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Isabela Costa',
                occupation: 'Arquiteta',
                id: '6'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Ricardo Mendes da Silva',
                occupation: 'Programador',
                id: '7'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Fernanda Rodrigues',
                occupation: 'Enfermeira',
                id: '8'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Gabriel Alves',
                occupation: 'Designer',
                id: '9'
            },
            {
                photo: 'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg',
                name: 'Carolina Castro',
                occupation: 'Psicóloga',
                id: '10'
            },];
            setContacts(users)
            // const response = await fetch('/contacts/list');
            // if (response.ok) {
                
            //     const data = await response.json();
            //     setContacts(data); 
            // } else {
            //     console.error('Erro ao obter os contatos');
            //     setError('Failed to fetch contacts.');
            // }
        }catch (error) {
            console.error('Erro na requisição:', error);
            setError('An error occurred while fetching the contacts.');
        }
    }
    const getRequests =  () => {
        try {
            const users: ContactsProps[] = [
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Júlia Souza',
                    occupation: 'Atriz',
                    id: '1'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Ana Silva',
                    occupation: 'Advogada',
                    id: '2'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Luana Freitas',
                    occupation: 'Nutricionista',
                    id: '3'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Ana Souza',
                    occupation: 'Professor',
                    id: '4'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Lucas Lima',
                    occupation: 'Estudante',
                    id: '5'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Isabela Costa',
                    occupation: 'Arquiteta',
                    id: '6'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Ricardo Mendes da Silva',
                    occupation: 'Programador',
                    id: '7'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Fernanda Rodrigues',
                    occupation: 'Enfermeira',
                    id: '8'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Gabriel Alves',
                    occupation: 'Designer',
                    id: '9'
                },
                {
                    photo: 'https://conteudo.imguol.com.br/c/esporte/26/2021/02/25/terry-crews-interpretou-julius-rock-em-todo-mundo-odeia-o-chris-1614287010913_v2_600x600.jpg',
                    name: 'Carolina Castro',
                    occupation: 'Psicóloga',
                    id: '10'
                },];
                setRequests(users)
            // const response = await fetch('/contacts/solicitations');
            // if (response.ok) {
            //     const data = await response.json();
            //     setRequests(data); 
            // } else {
            //     console.error('Erro ao obter as solicitações');
            //     setError('Erro ao obter as solicitações.');
            // }
        }catch (error) {
            console.error('Erro na requisição:', error);
            setError('Erro na requisição');
        }
    }
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
                setError('Failed to update contacts.');
            }
        })
        .then((data) => {
            if (data) {
                //setContacts(data);
            }
        })
        .catch((error) => {
            console.error('Erro na requisição:', error);
            setError('An error occurred while updating the contacts.');
        });
    };
    
//       // useEffect com a função getContacts
//   useEffect(() => {
//     getContacts();
        // getRequests();
    
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
                        <p className={`title-contacts title-content-left ${!showRequests ? 'active' : ''}`} onClick={()=> {
                            getContacts(); 
                            setShowRequests(false)
                        }}
                        >Contatos</p>
                        <p className={`title-contacts title-content-right ${showRequests ? 'active' : ''}`} onClick={() => {
                            getRequests();
                            setShowRequests(true);
                        }}             
                        >Solicitações</p>
                    </div>
                    <p className="contacts-line"></p>

                    {/* div dos cards */}
                    <div className="container-contact-cards">
                    {showRequests ? requests.map((user) => (
                        <ContactCard
                        key={user.id}
                        user={user}
                        onAddClick={(userId, friendId) => updateFriends(userId, friendId)}
                        onRemoveClick={(userId) => {/* Lógica para remover contato */}}
                        />
                    )) : contacts?.map((user) => (
                        <ContactCard
                        key={user.id}
                        user={user}
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
  