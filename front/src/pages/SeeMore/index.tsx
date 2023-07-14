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
                    Mollitia delectus sequi consequatur voluptate laudantium dolor ducimus, exercitationem rem, dolorum debitis dolores tenetur hic natus a dicta odit ex asperiores totam sit ipsum. Maxime amet quos omnis sapiente adipisci?
                    Eius eos qui nostrum vitae sunt illo illum, amet eveniet, atque culpa labore a eum incidunt consequatur. Culpa fugiat, vitae numquam, dolore esse, repudiandae voluptas sit dolor reprehenderit accusantium tempore?
                    Nulla assumenda atque a iure eligendi similique et blanditiis, rerum quod facere rem at fugit quidem reiciendis neque facilis nobis sit recusandae veniam incidunt repellendus mollitia fugiat earum? Amet, voluptatum.</p>
                    <Button category="primary" label="Voltar" onClick={() => navigate('/landing-page')}/> 
                </div>
            </div>
        </div>
      
    );
  };
  