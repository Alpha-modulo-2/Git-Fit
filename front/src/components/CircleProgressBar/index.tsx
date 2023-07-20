import "./styles.css"

interface PropTypes {
    progress: number
    title_bar: any;
}

export const CircleProgressBar = ({progress, title_bar}:PropTypes) => {
    let percentage_progress = "";
    let title_progress = '';
    if(progress>50){
        percentage_progress= "progress-circle over50 p" + progress;
    }else{
        percentage_progress = "progress-circle p" + progress;
    }

    if(title_bar != ""){
        title_progress=title_bar;
    }else{
        title_progress = progress + "%";  
    }

    return (
        <div className="structure-circle-progress-bar">
            <div className={percentage_progress}>
                <span>{title_progress}</span>
                <div className="clipper-progress-bar">
                    <div className="first50-bar"></div>
                    <div className="value-bar"></div>
                </div>
            </div>
    </div>

    );
}