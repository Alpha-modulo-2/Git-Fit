// ContactCard.tsx
import React from 'react';
import { XCircle, Check, UserCirclePlus } from "@phosphor-icons/react";
import { Friend, User } from '../../interfaces/IUser';
import { useNavigate } from 'react-router-dom'; 

interface ContactCardProps{
  requesterInfo?: User | Friend;
  requestId?: string; 
  recipientId?: string;
  onUpdateFriends?: (requestId: string, requesterId: string) => void;
  onRemoveFriends?: (requestId: string) => void;
  onAddFriend?: (requestId: string, recipientId: string) => void; //id do usuário a ser adicionado e de quem tá solicitando
  typeOfCard: "request" | "contact" | "addUser";
}


const ContactCard: React.FC<ContactCardProps> = ({ requesterInfo, requestId, onUpdateFriends, onRemoveFriends, onAddFriend, recipientId, typeOfCard }) => {
const navigate = useNavigate();
const imageId = requesterInfo?.photo;
const image = imageId ? `/uploads/${imageId}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png';

const handleIconClick = (ContactCard?: () => void) => (event: React.MouseEvent) => {
  event.stopPropagation();
  if (ContactCard) ContactCard();
};

function validate() {
  if(requesterInfo !== undefined && requesterInfo._id ) {
    const contactId = requesterInfo._id
    navigate(`/contact_profile/${contactId}`)
  }
  
}

return (
    <div className="contact-card"  onClick={() => validate() }>
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
            onClick={handleIconClick(() => (onUpdateFriends && requestId && requesterInfo) && onUpdateFriends(requestId, requesterInfo?._id))}
          />
          <XCircle
            size={20}
            color="black"
            className="icon-remove-contact"
            onClick={handleIconClick(() => (onRemoveFriends && requestId && requesterInfo) && onRemoveFriends(requestId))}
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
              onClick={handleIconClick(() => (onAddFriend && requestId && recipientId) && onAddFriend(requestId, recipientId))}
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
