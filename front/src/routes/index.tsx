import { Route, Routes, Navigate } from "react-router-dom";
import { ReactElement } from 'react';
import { LandingPage } from "../pages/LandingPage";
import { Register } from "../pages/Register";
import { Profile } from "../pages/Profile";
import { PerfilEdit } from '../pages/PerfilEdit';
import { Login } from '../pages/Login';
import { SeeMore } from '../pages/SeeMore';
import { Contacts } from '../pages/ContactsAndRequests';
import { SearchedResults } from "../pages/SearchResults";
import { SearchedUsersProvider } from "../context/searchedUsersContext"; 
import { FullCard } from "../pages/FullCards";
import { useAuth } from '../context/authContext';
// import { Error404 } from '../pages/Error404';


interface ChildrenTypes {
  children: ReactElement;
}

const Private = ({ children }: ChildrenTypes) => {
  const {isLoggedIn} = useAuth()
  
  const checkCookieExists = (cookieName: string) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      if (cookie.trim().startsWith(`${cookieName}=`)) {
        return true;
      }
    }
    return false;
  };
  const sessionCookieExists = checkCookieExists('session');
  
  if (!sessionCookieExists && !isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const Router = () => {
  return (
    <div>
      <SearchedUsersProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/landing_page" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/see-more" element={<SeeMore/>} />
          <Route 
              path="/edit/:id" 
              element={
                <Private>
                  <PerfilEdit/>
                </Private>
               }/>
          <Route 
              path="/contacts" 
              element={
                <Private>
                  <Contacts/>
                </Private>
              }/>
          <Route
              path="/profile" 
              element={
                <Private>
                  <Profile/>
                </Private>
              } />
          <Route 
              path="/fullcard/:id"
              element={
                <Private>
                  <FullCard />
                </Private>
              } />
          <Route 
              path="/searched_results" 
              element={
                <Private>
                  <SearchedResults/>
                </Private>
              } />
          {/* <Route path="*" element={<Error404 />} />
           */}
        </Routes>
      </SearchedUsersProvider>  
    </div>
  );
};
