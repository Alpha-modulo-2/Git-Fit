import { Route, Routes } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { Register } from "../pages/Register";
import { Profile } from "../pages/Profile";
// import { Catalog } from '../pages/Catalog';
// import { Error404 } from '../pages/Error404';
// import { Home } from '../pages/Home';

export const Router = () => {
  return (
    <Routes>
      <Route path="/landing_page" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="*" element={<Error404 />} />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/details/:type/:movieTitle/:movieId" element={<Details />} /> */}
    </Routes>
  );
};
