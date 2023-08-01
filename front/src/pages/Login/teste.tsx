import { Button } from "../../components/Button";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Form(props: FormProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <label className="loginTitle">Login</label>
      <br />
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
      <button type="submit">funfa</button>
    </form>
  );
}
