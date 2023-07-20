import "./styles.css"
import { Header } from "../../components/Header";
// import { Button } from "../../components/Button";

import { UserCirclePlus } from "@phosphor-icons/react";
// import {  NavigateFunction, useNavigate } from 'react-router-dom';

export const Contacts = () => {
    const user= {
        photo: 'https://img.freepik.com/fotos-gratis/o-retrato-do-modelo-louro-de-sorriso-bonito-vestiu-se-na-roupa-do-moderno-do-verao_158538-5482.jpg?size=626&ext=jpg&ga=GA1.2.751252608.1688752234&semt=ais',
        name:  'Broklyn',
        occupation: 'Doctor'
    }
    // const navigate: NavigateFunction = useNavigate();
    return (
      
        <div className="contacts-page">
            <Header isLoggedIn={true}/>
            <div className="container-contacts-request">
                <div className="content-contacts">
                    <div className="container-titles-contacts">
                        <p className="title-contacts title-content-left">Contatos</p>
                        {/* <p className="titles-line"></p> */}
                        <p className="title-contacts title-content-right">Solicitações</p>
                    </div>
                    <p className="contacts-line"></p>

                    {/* div dos cards */}
                    <div className="container-contact-cards">
                        <div className="contact-card">
                            <div className="img-card-contacts">
                                <img src={user.photo} alt="" />
                            </div>
                            
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        <div className="contact-card">
                            <img src={user.photo} alt="" className="img-card-contacts"/>
                            <div>
                                <p>{user.name}</p>
                                <p>{user.occupation}</p>
                            </div>
                            <div className="icon-add-contact">
                                <UserCirclePlus size={20} color="black" />
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
      
    );
  };
  