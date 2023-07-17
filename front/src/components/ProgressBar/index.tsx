import "./styles.css"

interface PropTypes {
    progress: number;
    title_bar: string;
}

export const ProgressBar = ({progress, title_bar}:PropTypes) => {
    return (
    <div className="structure-progress-bar">
        <div className="title-bar">
            <h4>{title_bar}</h4>
        </div>
        <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
    );
}