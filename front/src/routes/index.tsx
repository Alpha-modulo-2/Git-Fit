import { Route, Routes } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { Register } from "../pages/Register";
import { Profile } from "../pages/Profile";
import { PerfilEdit } from '../pages/PerfilEdit';
import { Login } from '../pages/Login';
import { SeeMore } from '../pages/SeeMore';
import { Contacts } from '../pages/ContactsAndRequests';
// import { Catalog } from '../pages/Catalog';
// import { Error404 } from '../pages/Error404';
// import { Home } from '../pages/Home';

export const Router = () => {
  return (
    <Routes>
      <Route path="/landing_page" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit" element={<PerfilEdit/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/see-more" element={<SeeMore/>} />
      <Route path="/contacts" element={<Contacts/>} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="*" element={<Error404 />} />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/details/:type/:movieTitle/:movieId" element={<Details />} /> */}
    </Routes>
  );
};
