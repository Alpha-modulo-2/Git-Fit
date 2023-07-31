/* ui/src/components/auth/Auth.tsx */

// Global imports
import { useEffect, useState, useContext, FormEventHandler } from "react";

// Project dependencies
import useApi from "../../hooks/api/useApi";
import  AuthContext  from "../../auth/AuthContextProvider";
import { validatePasswordLength, validateEmailFormat } from "./Validation"
import { AuthData } from "../../hooks/api/apiData";
import { useLocation } from "react-router-dom";
import LoginForm from "./LogInForm";
import RegisterForm from "./RegisterForm";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";

const Auth = () => {
  const [authData, setAuthData] = useState<AuthData>();
  const { request, setError } = useApi();
  const { globalLogInDispatch } = useContext(AuthContext);
  const location = useLocation();
  const currentPathArray = location.pathname.split('/');
  const isLogin = currentPathArray[currentPathArray.length - 1] === 'login';

  // Upon successful response from the api for login user, dispatch global auth LOG_IN event
  useEffect(() => {
    if (authData && "success" in authData) {
      globalLogInDispatch({
        authToken: authData.user.auth_token,
        userId: authData.user.user_id,
        name: authData.user.name,
        email: authData.user.email,
      });
    }
  }, [authData, globalLogInDispatch]);

  const authHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Validations first!
    const userEmail = data.get("email");
    const userPassword = data.get("password");
    const userName = data.get("name");
    try {
      if (
        !validateEmailFormat(userEmail?.toString() || "") ||
        !validatePasswordLength(userPassword?.toString() || "")
      ) {
        throw new Error("Incorrect credential format!");
      }
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
          name: userName,
        }),
      };

      const endpoint = `/${isLogin ? 'login' : 'register'}`
      await request(endpoint, params, setAuthData);
    } catch (error: any) {
      setError(error.message || error);
    }
  };

  return (
    <>
    <h1>consumir</h1>
      <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
      {
        isLogin
          ? <Login onSubmit={authHandler} />
          : <Register onSubmit={authHandler} />
      }
    </>
  );
};

export default Auth;