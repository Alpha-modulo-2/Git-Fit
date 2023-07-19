import "./styles.css"

interface PropTypes {
    url_photo: string;
    user_name: string;
}

export const PhotoProfile = ({url_photo, user_name}:PropTypes) => {
    return (
    <div className="structure-photo-profile">
        <div className="moldure-photo">
            <img className="photo-profile" src={url_photo} />
        </div>
        <div className="name-profile">
            <h3>{user_name}</h3>
        </div>
    </div>

    );
}