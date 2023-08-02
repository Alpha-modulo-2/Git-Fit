import "./styles.css";
interface PropTypes {
  children: string;
  onClick: () => void;
}

export const Modal = ({ children, onClick }: PropTypes) => {
    function stopPropagation(event: React.MouseEvent): void {
      event.stopPropagation();
    }
    return (
      <div className="modal-background" onClick={onClick}>
      <div className="modal-content" onClick={stopPropagation}>
        {children}
      </div>
    </div>
      );
  };
  