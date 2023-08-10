interface FormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export default function Form(props: FormProps) {
    return (
      <form className="formLogin" onSubmit={props.onSubmit}>
        <input
          type="text"
          className="input-login"
          placeholder="Nome de Usuário"
          onChange={props.handleUserNameChange}
        />
        <br />
        <input
          type="password"
          className="input-login"
          placeholder="Senha"
          onChange={props.handlePasswordChange}
        />
        <br />
        <button className="buttonLogin" type="submit">Entrar</button>
      </form>
    );
  }
  