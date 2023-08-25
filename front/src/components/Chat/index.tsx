import { useState, useEffect, useRef } from "react";
import { generalRequest } from "../../generalFunction";
import { Socket } from "socket.io-client";
import { useAuth } from '../../context/authContext';
import { io } from "socket.io-client";
import "./styles.css"
import { ChatCircleText, X, PaperPlaneRight } from "@phosphor-icons/react";
import { User } from "../../interfaces/IUser.ts"
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';


interface ChatData {
    _id: string;
    members: Array<{ _id: string }>;
    unreadCount: number
}

interface SocketMessage {
    chatMessage: Message | Message[]
    error: boolean
    statusCode: number
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
    isRead?: boolean;
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
    const { user, setLoggedUser } = useAuth();

    if (!user) {
        throw new Error('Usuário não existe')
    }

    const userId = String(user._id);

    const [chatOpen, setChatOpen] = useState<boolean>(false);

    const [messages, setMessages] = useState<Array<Message>>([]);
    const [showChat, setShowChat] = useState(false);
    const [chats, setChats] = useState<ChatData[]>([]);

    const [currentlyFriend, setCurrentlyFriend] = useState('Other');
    const [inputMessage, setInputMessage] = useState('');

    const urlPath = import.meta.env.VITE_URL_PATH;

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const toggleChat = async () => {
        setChatOpen(!chatOpen);
        onChatOpen(!chatOpen);
        if (chatOpen) {
            closeChat()
        } else {
            fetchUserData().catch(() => {
                console.error("deu ruim")
            })
            await searchChats(userId);
        }

        return
    };

    const initChat = async (friend: Friend) => {
        setCurrentlyFriend(friend.userName)
        await chatWithFriend(friend._id, chats)
    }

    const user_photo = new URL("../../assets/images/placeholderphoto.jpg", import.meta.url).href

    const fetchUserData = async () => {
        if (user) {
            try {
                const response = await generalRequest(`/users/${user?._id}`);
                setLoggedUser(response as User);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário', error);
            }
        }

    };





    const searchChats = async (userId: string) => {
        try {
            const response = await generalRequest(`/conversations/${userId}`);
            const userChats: Array<ChatData> = response as Array<ChatData>;
            setChats(userChats)
            return userChats;
        } catch (error) {
            console.error("Error getting chats:", error);
            return [];
        }
    };

    const chatWithFriend = async (friendId: string, chatList: Array<ChatData>) => {
        try {
            const chat = chatList.find((chat: ChatData) =>
                chat.members.some((member) => member._id === friendId)
            );

            if (chat) {
                openChatPopup(chat._id);
            } else {
                await generalRequest(`/conversations`, { userId: userId, friendId: friendId }, 'POST');
                const newChats = await searchChats(userId);
                await chatWithFriend(friendId, newChats);
            }
        } catch (error) {
            console.error("Error getting chats:", error);
        }
    }

    const openChatPopup = (chatId: string) => {
        currentChatId = chatId;
        setShowChat(true);
        if (socket) {
            socket.disconnect();
        }
        if (urlPath) {
            socket = io(urlPath);
        } else {
            socket = io();
        }
        socket.on('receiveMessage', (messageData: SocketMessage) => {

            if ((messageData.chatMessage as Message).chatId === chatId) {

                const newMessages = Array.isArray(messageData.chatMessage) ? messageData.chatMessage : [messageData.chatMessage];
                setMessages(prevMessages => [...prevMessages, ...newMessages]);

            }
        });

        socket.on('chatHistory', async (messages: SocketMessage) => {
            const messageList = Array.isArray(messages.chatMessage) ? messages.chatMessage : [messages.chatMessage];
            const reversedMessages = [...messageList].reverse(); // Cria uma cópia do array e inverte a ordem

            setMessages(reversedMessages);

            const unreadMessages = reversedMessages.filter(message => !message.isRead && message.sender !== userId);

            if (unreadMessages.length !== 0) {
                await markMessagesAsRead(unreadMessages.map(message => message._id as string));
            }
        });

        socket.emit('joinRoom', chatId);
    }

    const renderMessages = () => {
        return messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === userId ? 'mine' : 'others'}`}>
                <div className="message-text">{message.text}</div>
                {message.created_at ? (
                    <p className={message.sender === userId ? 'message-time-white' : 'message-time-black'}>
                        {formatMessageTime(message?.created_at)}
                    </p>
                ) :
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

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    };

    function sendMessage() {
        if (inputMessage && currentChatId && socket) {
            socket.emit('sendMessage', {
                chatId: currentChatId,
                sender: userId,
                text: inputMessage,
            });
            setInputMessage('');  // Reset the inputMessage state, which is bound to the input field.
        }
    }

    const markMessagesAsRead = async (messageIds: string[]) => {
        try {
            await generalRequest(`/messages/markAsRead`, { messageIds }, 'POST');
            await searchChats(userId);
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const closeChat = () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        currentChatId = null;
        setShowChat(false);
        setCurrentlyFriend('Other');
    }

    useEffect(() => {
        if (!showChat) {
            setMessages([]);
        }
    }, [showChat]);



    return (
        <div className="chat-container">
            <div className="chat-button" onClick={() => toggleChat()}>
                {chatOpen ?
                    <X size={40} color="white" className="close-button-msg" />
                    : <ChatCircleText size={40} color="white" />}
            </div>
            <div className={`chat-container-msg ${chatOpen ? "chat-open" : "chat-close"}`}>
                {showChat ?
                    <div className="box-open-msgs">
                        <div className="header_open_msg">
                            <p>{currentlyFriend}</p>
                            <X size={22} color="#5e35aa" weight="bold" onClick={closeChat} />
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
                            <PaperPlaneRight size={15} color="#5e35aa" className="button_send_message" onClick={sendMessage} />
                        </div>
                    </div>
                    : <div className="box-users-msgs">
                        {user.friends.length != 0 ? user.friends.map((friend) => {
                            const associatedChat = chats.find((chat: ChatData) => chat.members.some((member) => member._id === friend._id));

                            return (
                                <div className="msg-card" onClick={() => { initChat(friend as any) }}>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <div className="img-card-msgs">
                                            <img
                                                src={friend.photo ? `/uploads/${friend.photo}` : user_photo}
                                                alt=""
                                            />
                                        </div>
                                        <div className="user-msg-info">
                                            <p className="username-msg">{(friend as Friend).name.length > 15 ? (friend as Friend).name.substring(0, 15) + "..." : (friend as Friend).name}</p>
                                            <p className="useroccupation-msg">{friend.occupation.length > 15 ? friend.occupation.substring(0, 15) + "..." : friend.occupation}</p>
                                        </div>
                                    </div>
                                    {
                                        associatedChat?.unreadCount ?
                                            <Badge badgeContent={associatedChat.unreadCount} color="secondary" >
                                                <MailIcon color="action" />
                                            </Badge> : <></>
                                    }
                                </div>
                            )
                        }) :
                            <div style={{ display: "flex", alignItems: "center", height: "25rem" }}>
                                <p>Você não tem contatos com quem conversar.</p>
                            </div>
                        }
                    </div>}
            </div>
        </div >

    );
};
