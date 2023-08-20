import { useState, useEffect, useRef } from "react";
import { generalRequest } from "../../generalFunction";
import { Socket } from "socket.io-client";
import { useAuth } from '../../context/authContext';
import { io } from "socket.io-client";
import "./styles.css"
import { ChatCircleText, X, PaperPlaneRight } from "@phosphor-icons/react";


interface ChatData {
    _id: string;
    members: Array<{ _id: string }>;
}

interface Friend {
    photo?: string;
    userName: string;
    name: string;
    occupation: string;
    _id: string;
} 

interface Message {
    chatId?: string;
    conversationId?: string;
    sender: string;
    text: string;
    _id?: string;
    created_at?: string;
    __v?: number;
}

interface ChatProps {
    onChatOpen: (chatOpen: boolean) => void;
}

interface Chat {
    members: Member[];
}

interface Member {
    _id: string;
}

let socket: Socket | null = null;
let currentChatId: string | null = null;

export const Chat = ({ onChatOpen }: ChatProps) => {
    const { user } = useAuth();

    if(!user){
        throw new Error('Usuário não exite')
    }

    const userId = String(user._id);

    const [chatOpen, setChatOpen] = useState<boolean>(false);

    const [messages, setMessages] = useState<Array<Message>>([]);
    const [showChat, setShowChat] = useState(false);

    const [currentlyFriend, setcurrentlyFriend] = useState('Other');
    const [inputMessage, setInputMessage] = useState('');

    const urlPath = import.meta.env.VITE_URL_PATH || "";

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const toggleChat = () => {
        setChatOpen((prevState) => !prevState);
        onChatOpen(!chatOpen);
        return
    };

    const initChat = async (friend: Friend) => {
        if (!userId) {
            alert("User ID is required!");
            return;
        }
        setcurrentlyFriend(friend.name)
        try {
            await searchChat(userId, friend._id);
        } catch (error) {
        console.error('Houve um erro ao buscar o chat:', error);
        }
    }

    const searchChat = async (userId: string, friendId: string) => {
        try {
            const response = await generalRequest(`/conversations/${userId}`);

            const userChats: Array<ChatData> = response as Array<ChatData>;

            const chatWithFriend = userChats.find((chat: ChatData) =>
                chat.members.some((member) => member._id === friendId)
            );

            if (chatWithFriend) {
                await openChatPopup(chatWithFriend._id);
            } else {
                await generalRequest(`/conversations`,{userId: userId, friendId: friendId}, 'POST');
                await  searchChat(userId, friendId);
            }
        } catch (error) {
            console.error("Error searching chat:", error);
        }
    };

    const openChatPopup = async (chatId: string) => {
        const response = await generalRequest(`/messages/${chatId}`)
        const messages: Message[] = response as Message[];
        setMessages(messages);
        messages.forEach(displayMessage);
        currentChatId = chatId;
        setShowChat(true);
        if (!socket) {
            socket = io(urlPath);
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
                <div className="message-text">{message.text}</div>
                {message.created_at ?(
                    <p className={message.sender === userId ? 'message-time-white' : 'message-time-black'}>
                        {formatMessageTime(message?.created_at)}
                    </p>
                ):
                    <p className={message.sender === userId ? 'message-time-white' : 'message-time-black'}>
                        {formatMessageTime(Date.now())}
                    </p>  
            }
            </div>
        ));
    };

    const formatMessageTime = (isoTimeString: string | number) => {
        const date = new Date(isoTimeString);
        const hours = String(date.getHours()).padStart(2, '0'); // Obtém as horas com zero à esquerda se for necessário
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Obtém os minutos com zero à esquerda se for necessário
        return `${hours}:${minutes}`;
    };

    function displayMessage(message: any) {
        const messagesDiv = document.querySelector('.body_box_msgs');
        const alignment = message.sender === userId ? 'mine' : 'others';
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', alignment);
        msgDiv.textContent = (alignment === 'mine' ? "You" : currentlyFriend) + ': ' + message.text;
        messagesDiv?.appendChild(msgDiv);
    }

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    };

    function sendMessage() {
        const input = document.querySelector('.input_send_message') as HTMLInputElement;
        const message = input.value;
        if (message && currentChatId && socket) {
            socket.emit('sendMessage', {
                chatId: currentChatId,
                sender: userId,
                text: message,
            });
            postMessage(currentChatId, userId, message);
            input.value = '';
            setInputMessage('');
        }
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        const url = `${urlPath}/messages`;

        const messageData: Message  = {
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
            .then(() => {
                const newmessages:  Message[] = [...messages, messageData];
                setMessages(newmessages);
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
            <div className={`chat-container-msg ${chatOpen ? "chat-open" : "chat-close"}`}>
                {showChat ?
                    <div className="box-open-msgs">
                        <div className="header_open_msg">
                            <p>{currentlyFriend}</p>
                            <X size={22} color="#5e35aa" weight="bold" onClick={closechat} />
                        </div>
                        <div className="body_box_msgs" ref={messagesContainerRef}>
                            {renderMessages()}
                        </div>
                        <div className="div_send_message">
                            <input type="text" 
                                className="input_send_message"
                                value={inputMessage}
                                placeholder="Digite algo..."
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                >
                            </input>
                            <PaperPlaneRight size={15} color="#5e35aa"  className="button_send_message" onClick={sendMessage} />
                        </div>
                    </div>
                    : <div className="box-users-msgs">
                        {user.friends.map((friend) => (
                            <div className="msg-card" onClick={() => initChat(friend as any)}>
                                <div className="img-card-msgs">
                                    <img
                                        src={friend.photo || "../src/assets/images/placeholderphoto.jpg"}
                                        alt=""
                                    />
                                </div>
                                <div className="user-msg-info">
                                    <p className="username-msg">{(friend as Friend).name.length > 15 ? (friend as Friend).name.substring(0, 15) + "..." : (friend as Friend).name}</p>
                                    <p className="useroccupation-msg">{friend.occupation.length > 15 ? friend.occupation.substring(0, 15) + "..." : friend.occupation}</p>
                                </div>
                            </div>
                        ))}
                    </div>}
            </div>
        </div>

    );
};
