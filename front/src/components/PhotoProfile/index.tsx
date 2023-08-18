import { useNavigate } from "react-router-dom";
import { PencilSimpleLine } from "phosphor-react";
import { useAuth } from "../../context/authContext";
import "./styles.css"

interface PropTypes {
    url_photo: string;
    user_name: string;
}

export const PhotoProfile = ({url_photo, user_name}:PropTypes) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    function verifyUser(){
        if(user){
            navigate(`/edit/${user._id}`)
        }
    }

    return (
    <div className="structure-photo-profile">
        <div className="moldure-photo">
            <div className="icon-edit-container" onClick={verifyUser}>
                <PencilSimpleLine size={20} color="black"  className="icon-editpage" />
            </div>
            <img className="photo-profile" src={url_photo} />
        </div>
        <div className="name-profile">
            <h3>{user_name}</h3>
        </div>
    </div>

    );
}