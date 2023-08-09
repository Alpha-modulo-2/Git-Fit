// ContactCard.tsx
import React from 'react';
import { XCircle, Check } from "@phosphor-icons/react";

interface ContactsProps{
    photo: string;
    name: string;
    occupation: string;
    id: string;
}

interface ContactCardProps {
  user: ContactsProps;
  onAddClick: (userId: string, friendId: string) => void;
  onRemoveClick?: (userId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ user, onAddClick, onRemoveClick }) => {
  return (
    <div className="contact-card">
      <div className="img-card-contacts">
        <img src={user.photo} alt="" />
      </div>

      <div className="user-contacts-info">
        <p className="username-contact">{user.name.length > 12 ? user.name.substring(0, 10) + "..." : user.name}</p>
        <p className="useroccupation-contact">{user.occupation.length > 12 ? user.occupation.substring(0, 10) + "..." : user.occupation}</p>
      </div>
      {onRemoveClick && (
            <div className="container-icon-contact">
                <Check
                    size={20}
                    color="black"
                    className="icon-add-contact"
                    onClick={() => onAddClick(user.id, 'friendId')}
                />
                <XCircle
                    size={20}
                    color="black"
                    className="icon-remove-contact"
                    onClick={() => onRemoveClick(user.id)}
                />
            </div>
        )}
    </div>
  );
};

export default ContactCard;
