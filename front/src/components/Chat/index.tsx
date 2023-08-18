import { useState, useEffect } from "react";
import { generalRequest } from "../../generalFunction";
import { UserData } from "../../interfaces/IUser";
import { useAuth } from '../../context/authContext';
import { io } from "socket.io-client";
import "./styles.css"
import { ChatCircleText, X } from "@phosphor-icons/react";

interface ChatData {
    _id: string;
    members: Array<{ _id: string }>;
}

interface ContactsProps {
    photo: string;
    name: string;
    occupation: string;
    id: string;
}

let socket: any;
let currentChatId: any = null;

export const Chat = ({ onChatOpen }) => {
    const { user } = useAuth();
    const userId = String(user?._id);

    const [chatOpen, setChatOpen] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>(null);

    const [messages, setMessages] = useState<Array<any>>([]);
    const [showChat, setShowChat] = useState(false);

    const [currentlyFriend, setcurrentlyFriend] = useState('Other');
    const [inputMessage, setInputMessage] = useState('');

    const fetchUserData = async () => {
        try {
            const response = await generalRequest(`/users/${userId}`) as UserData;
            const data = response;
            setUserData(data);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário', error);
        }
    };
    fetchUserData();

    let friends: ContactsProps[] = [];
    if (userData) {
        friends = userData.friends;
    }

    const toggleChat = () => {
        setChatOpen((prevState) => !prevState);
        onChatOpen(!chatOpen);
    };

    const initChat = (friend: any) => {
        if (!userId) {
            alert("User ID is required!");
            return;
        }
        setcurrentlyFriend(friend.name)
        searchChat(userId, friend._id)
    }

    const searchChat = async (userId: string, friendId: string) => {
        try {
            const response = await generalRequest(`/conversations/${userId}`);
            const userChats: Array<ChatData> = response as Array<ChatData>;

            const chatWithFriend = userChats.find((chat: any) =>
                chat.members.some((member: any) => member._id === friendId)
            );

            if (chatWithFriend) {
                console.log("Chat com o amigo:", chatWithFriend);
                openChatPopup(chatWithFriend._id);
            } else {
                console.log("Não possui chat com o amigo:", friendId);
                await generalRequest(`/conversations`,{userId: userId, friendId: friendId}, 'POST');
                console.log("chego")
                searchChat(userId, friendId);
            }
        } catch (error) {
            console.error("Error searching chat:", error);
        }
    };

    const openChatPopup = async (chatId: string) => {
        console.log(chatId)
        const response = await generalRequest(`/messages/${chatId}`)
        const messages: any[] = response as any[];
        console.log(messages)
        setMessages(messages);
        messages.forEach(displayMessage);
        currentChatId = chatId;
        setShowChat(true);

        if (!socket) {
            socket = io('https://localhost:443');

            socket.on('receiveMessage', (messageData: any) => {
                if (messageData.chatId === chatId) {
                    displayMessage(messageData);
                }
            });
        }
        socket.emit('joinRoom', chatId);
    }


    const renderMessages = () => {
        return messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === userId ? 'mine' : 'others'}`}>
                {message.sender === userId ? 'You' : currentlyFriend}: {message.text}
            </div>
        ));
    };


    function displayMessage(message: any) {
        const messagesDiv = document.querySelector('.body_box_msgs');
        const alignment = message.sender === userId ? 'mine' : 'others';
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', alignment);
        msgDiv.textContent = (alignment === 'mine' ? "You" : currentlyFriend) + ': ' + message.text;
        messagesDiv?.appendChild(msgDiv);
    }

    function sendMessage() {
        const input = document.querySelector('.input_send_message') as HTMLInputElement;
        const message = input.value;
        if (message && currentChatId) {
            socket.emit('sendMessage', {
                chatId: currentChatId,
                sender: userId,
                text: message,
            });
            postMessage(currentChatId, userId, message); // Adicionar a mensagem ao chat na página
            input.value = '';
        }
    }

    const closechat = () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        currentChatId = null;
        setShowChat(false);
        setcurrentlyFriend('Other');
    }

    useEffect(() => {
        if (!showChat) {
            setMessages([]);
        }
    }, [showChat]);
    

    function postMessage(chatId: string, senderId: string, content: string) {
        const url = `https://localhost:443/messages`;

        const messageData = {
            conversationId: chatId,
            sender: senderId,
            text: content
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Message posted successfully:", data);
            })
            .catch(error => {
                console.error("Error posting message:", error);
            });
    }

    return (
        <div className="chat-container">
            <div className="chat-button" onClick={toggleChat}>
                {chatOpen ?
                    <X size={40} color="white" className="close-button-msg" />
                    : <ChatCircleText size={40} color="white" />}
            </div>
            <div className={`chat-container-msg ${chatOpen ? "chat-open" : ""}`}>
                {showChat ?
                    <div className="box-open-msgs">
                        <div className="header_open_msg">
                            <h3>{currentlyFriend}</h3>
                            <h3 onClick={closechat}>X</h3>
                        </div>
                        <div className="body_box_msgs">
                            {renderMessages()}
                        </div>
                        <div className="div_send_message">
                            <input type="text" 
                                className="input_send_message"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}>
                            </input>
                            
                            <img src="https://www.pinclipart.com/picdir/middle/201-2016537_send-message-icon-white-clipart-computer-icons-clip.png"
                             className="button_send_message" onClick={sendMessage}></img>
                        </div>
                    </div>
                    : <div className="box-users-msgs">
                        {friends.map((friend) => (
                            <div className="msg-card" onClick={() => initChat(friend)}>
                                <div className="img-card-msgs">
                                    <img
                                        src={friend.photo || "https://www.logolynx.com/images/logolynx/b4/b4ef8b89b08d503b37f526bca624c19a.jpeg"}
                                        alt=""
                                    />
                                </div>
                                <div className="user-msg-info">
                                    <p className="username-msg">{friend.name.length > 15 ? friend.name.substring(0, 15) + "..." : friend.name}</p>
                                    <p className="useroccupation-msg">{friend.occupation.length > 15 ? friend.occupation.substring(0, 15) + "..." : friend.occupation}</p>
                                </div>
                            </div>
                        ))}
                    </div>}
            </div>
        </div>

    );
};


