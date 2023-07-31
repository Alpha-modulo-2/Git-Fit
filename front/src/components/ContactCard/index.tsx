// ContactCard.tsx
import React from 'react';
import { XCircle, Check } from "@phosphor-icons/react";

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
  onAddClick: (userId: string, friendId: string) => void;
  onRemoveClick?: (userId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ requesterInfo, onAddClick, onRemoveClick }) => {
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
      {onRemoveClick && (
            <div className="container-icon-contact">
                <Check
                    size={20}
                    color="black"
                    className="icon-add-contact"
                    onClick={() =>  requesterInfo && onAddClick(requesterInfo._id, 'friendId')}
                />
                <XCircle
                    size={20}
                    color="black"
                    className="icon-remove-contact"
                    onClick={() =>  requesterInfo && onRemoveClick(requesterInfo._id)}
                />
            </div>
        )}
    </div>
  );
};

export default ContactCard;
