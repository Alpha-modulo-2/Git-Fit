import "./styles.css";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="landing-page">
      <Header isLoggedIn={false} />
      <div className="container-all-content">
        <div className="logo-name">
          <p className="logo-name-git">Git</p>
          <p className="logo-name-fit">Fit</p>
        </div>
        <div className="container-label">
          <p className="text-content">
            Procurando uma maneira de organizar sua vida e entrar em forma? O Git-Fit é a resposta. Com nosso aplicativo, você pode rastrear suas refeições e exercícios diários, tudo em um só lugar. Conecte-se com profissionais de saúde e fitness, converse em tempo real e alcance seus objetivos de bem-estar como nunca antes. Faça parte do movimento Git-Fit e eleve sua eficiência diária a novos patamares.
          </p>
          <div className="text-info">
            <Button
              category="primary"
              label="Ver mais"
              onClick={() => navigate("/see-more")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
