// ContactCard.tsx
import React from 'react';
import { XCircle, Check, UserCirclePlus } from "@phosphor-icons/react";
import { Friend, UserData } from '../../interfaces/IUser';


interface ContactCardProps{
  requesterInfo?: UserData | Friend;
  requestId?: string; 
  recipientId?: string;
  onUpdateFriends?: (requestId: string, requesterId: string) => void;
  onRemoveFriends?: (requestId: string) => void;
  onAddFriend?: (requestId: string, recipientId: string) => void; //id do usuário a ser adicionado e de quem tá solicitando
  typeOfCard: "request" | "contact" | "addUser";
}


const ContactCard: React.FC<ContactCardProps> = ({ requesterInfo, requestId, onUpdateFriends, onRemoveFriends, onAddFriend, recipientId, typeOfCard }) => {
  const imageId = requesterInfo?.photo;
  const image = imageId ? `../src/assets/images/${imageId}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png';

  return (
    <div className="contact-card">
      <div className="img-card-contacts">
        <img src={image} alt="Texto" />
      </div>

      <div className="user-contacts-info">
        <p className="username-contact">
          {requesterInfo?.userName && requesterInfo.userName.length >= 12 
            ? requesterInfo.userName.substring(0, 10) + "..." 
            : requesterInfo?.userName}
        </p>
        <p className="useroccupation-contact">
          {requesterInfo?.occupation && requesterInfo?.occupation.length >= 12 
            ? requesterInfo.occupation.substring(0, 10) + "..." 
            : requesterInfo?.occupation}
        </p>
      </div>


      { typeOfCard === 'request' && (
        <div className="container-icon-contact">
          <Check
            size={20}
            color="black"
            className="icon-add-contact"
            onClick={() => (onUpdateFriends && requestId && requesterInfo) && onUpdateFriends(requestId, requesterInfo?._id)}
          />
          <XCircle
            size={20}
            color="black"
            className="icon-remove-contact"
            onClick={() => (onRemoveFriends && requestId && requesterInfo) && onRemoveFriends(requestId)}
          />
        </div>
      )}
      
      {
        typeOfCard === 'addUser' &&(
          <div className="container-icon-contact">
            <UserCirclePlus
              size={20}
              color="black"
              className="icon-add-friend"
              onClick={() => (onAddFriend && requestId && recipientId) && onAddFriend(requestId, recipientId)}
            />
          </div>
        )
      }
      {
       typeOfCard === 'contact' &&(
          <div className="container-icon-contact">
           
          </div>
        )
      }
    </div>
  );
};

export default ContactCard;
