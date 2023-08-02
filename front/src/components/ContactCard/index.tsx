// ContactCard.tsx
import React from 'react';
import { XCircle, Check, UserCirclePlus } from "@phosphor-icons/react";

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

interface ContactCardProps {
  requesterInfo?: User;
  requestId: string; // Recebe o request._id da página principal
  onUpdateFriends?: (requestId: string) => void;
  onRemoveFriends?: (requestId: string) => void;
  onAddFriend?: (requestId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ requesterInfo, requestId, onUpdateFriends, onRemoveFriends, onAddFriend }) => {
  return (
    <div className="contact-card">
      <div className="img-card-contacts">
        <img src={'https://1.bp.blogspot.com/-KLg5TEY1v6U/T6P9I6YPZwI/AAAAAAAABEc/iYpstw_ouMQ/s1600/Mr_bean.jpg'} alt="" />
      </div>

      <div className="user-contacts-info">
        <p className="username-contact">
          {requesterInfo?.userName && requesterInfo.userName.length > 12 
            ? requesterInfo.userName.substring(0, 10) + "..." 
            : requesterInfo?.userName}
        </p>
        <p className="useroccupation-contact">
          {requesterInfo?.occupation && requesterInfo?.occupation.length > 12 
            ? requesterInfo.occupation.substring(0, 10) + "..." 
            : requesterInfo?.occupation}
        </p>
      </div>


        {onUpdateFriends || onRemoveFriends ? (
          <div className="container-icon-contact">
            <Check
              size={20}
              color="black"
              className="icon-add-contact"
              onClick={() => onUpdateFriends && onUpdateFriends(requestId)}
            />
            <XCircle
              size={20}
              color="black"
              className="icon-remove-contact"
              onClick={() => onRemoveFriends && onRemoveFriends(requestId)}
            />
          </div>
        ) : <span className="container-icon-contact"></span>}      
    </div>
  );
};

export default ContactCard;
