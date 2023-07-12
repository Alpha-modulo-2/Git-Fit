import "./styles.css"
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import {  NavigateFunction, useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const navigate: NavigateFunction = useNavigate();
    return (
      
        <div className="landing-page">
            <Header isLoggedIn={true}/>
            <div className="container-all-content">
                <div className="container-content">
                    <div className="logo-name">
                        <p className="logo-name-git">Git</p>
                        <p className="logo-name-fit">Fit</p>
                    </div>
                    <div className="text-info">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text </p>
                        <Button category="primary" label="Ver mais" onClick={() => navigate('/register')}/>
                    </div>
                </div>
            </div>
        </div>
      
    );
  };
  