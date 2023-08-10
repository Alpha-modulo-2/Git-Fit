// ContactCard.tsx
import React from 'react';
import { XCircle, Check, UserCirclePlus } from "@phosphor-icons/react";
import { User } from '../../interfaces/IUser';

interface ContactCardProps {
  requesterInfo?: User;
  requestId?: string; // Recebe o request._id da página principal
  recipientId?: string;
  onUpdateFriends?: (requestId: string) => void;
  onRemoveFriends?: (requestId: string) => void;
  onAddFriend?: (requestId: string, recipientId: string) => void; //id do usuário a ser adicionado e de quem tá solicitando
}

const ContactCard: React.FC<ContactCardProps> = ({ requesterInfo, requestId, onUpdateFriends, onRemoveFriends, onAddFriend, recipientId }) => {
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


      {onUpdateFriends && onRemoveFriends && requestId ? (
        <div className="container-icon-contact">
          <Check
            size={20}
            color="black"
            className="icon-add-contact"
            onClick={() => onUpdateFriends(requestId)}
          />
          <XCircle
            size={20}
            color="black"
            className="icon-remove-contact"
            onClick={() => onRemoveFriends(requestId)}
          />
        </div>
      ) : onAddFriend && recipientId && (requestId) && (
        <div className="container-icon-contact">
          <UserCirclePlus
            size={20}
            color="black"
            className="icon-add-friend"
            onClick={() => onAddFriend(requestId, recipientId)}
          />
        </div>
      )}
    </div>
  );
};

export default ContactCard;
