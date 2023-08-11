import { useState, useEffect } from 'react';
import { FriendRequest } from '../../interfaces/IContacts';
import { ApiResponseRequests } from '../../interfaces/IContacts';

// import { useAuth } from '../../context/authContext';


export function UserFriendRequests(userId: string) {
    const [requests, setRequests] = useState<FriendRequest[] | null>(null);
    // const { user } = useAuth();

    if (userId) {
        getRequests().catch((error) => {
            console.error('Erro ao obter as solicitações:', error);
        });
    }

    async function getRequests() {
        try {                    
            const response = await fetch(`http://localhost:3000/friendRequests/${userId}`);
            if (response.ok) {
                const data = await response.json() as ApiResponseRequests;
                setRequests(data.friendRequests); 
            } else {
                console.error('Erro ao obter as solicitações');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

        

    return requests;
}

export default UserFriendRequests;
