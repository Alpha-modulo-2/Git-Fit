import "./styles.css"
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import {  NavigateFunction, useNavigate } from 'react-router-dom';

export const SeeMore = () => {
    const navigate: NavigateFunction = useNavigate();
    return (
      
        <div className="see-more">
            <Header isLoggedIn={false}/>
            <div className="container-all-content-seemore">
                <div className="container-content-seemore">
                    <p className="text-see-more">
                        Aqui no Git-Fit, nossa missão é mais do que apenas um aplicativo - é um estilo de vida. Nós nos dedicamos a ajudar você a melhorar suas habilidades organizacionais e gerenciar suas tarefas diárias de maneira eficiente. Queremos tornar o bem-estar acessível e viável para todos, oferecendo uma plataforma única para monitorar sua saúde e fitness. Com a funcionalidade de chat integrada, colocamos você em contato direto com profissionais que podem ajudar a guiar seu caminho para o sucesso. O Git-Fit é mais do que apenas um aplicativo; é sua comunidade para crescimento e sucesso.</p>
                    <Button category="primary" label="Voltar" onClick={() => navigate('/landing-page')}/> 
                </div>
            </div>
        </div>
      
    );
  };
  