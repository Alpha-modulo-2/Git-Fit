import { useState } from "react";
import "./styles.css"

import { ChatCircleText, X } from "@phosphor-icons/react";
// import { useState, useEffect } from "react";

interface ContactsProps{
    photo: string;
    name: string;
    occupation: string;
    id: string;
}

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

export const Chat = () => {
    const [chatOpen, setChatOpen] = useState<boolean>(false);

    const toggleChat = () => {
        setChatOpen((prevState) => !prevState);
    };

    return (
        <div className="chat-container">
            <div className="chat-button" onClick={toggleChat}>
                {chatOpen ? 
                <X size={40} color="white" className="close-button-msg"/>
                : <ChatCircleText size={40} color="white"/>}
            </div>
            <div className={`chat-container-msg ${chatOpen ? "chat-open" : ""}`}>
                <div className="search-box-msg">
                    <input type="text" className="search-text-msg"/>
                </div>
                <div className="box-users-msgs">
                    {users.map((user) => (
                    <div className="msg-card">
                        <div className="img-card-msgs">
                            <img src={user.photo} alt="" />
                        </div>
                        <div className="user-msg-info">
                            <p className="username-msg">{user.name.length > 15 ? user.name.substring(0, 15) + "..." : user.name}</p>
                            <p className="useroccupation-msg">{user.occupation.length > 15 ? user.occupation.substring(0, 15) + "..." : user.occupation}</p>
                        </div>
                        <div className="container-icon-new-msgs">
                        <p>2</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            
        </div>
      
    );
  };
  