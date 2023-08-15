import "./styles.css"
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import {  NavigateFunction, useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const navigate: NavigateFunction = useNavigate();
    return (
      
        <div className="landing-page">
            <Header isLoggedIn={false}/>
            <div className="container-all-content">
                <div className="container-content">
                    <div className="logo-name">
                        <p className="logo-name-git">Git</p>
                        <p className="logo-name-fit">Fit</p>
                    </div>
                    <div className="text-info">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's s
                            tandard dummy text Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy textLorem Ipsum is simply dummy text of the 
                            printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy textLorem Ipsu
                            m is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's s
                            tandard dummy text</p>
                        <Button category="primary" label="Ver mais" onClick={() => navigate('/see-more')}/>
                    </div>
                </div>
            </div>
        </div>
      
    );
  };
  