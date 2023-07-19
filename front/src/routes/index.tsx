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
      <Route path="/landing" Component={LandingPage} />
      <Route path="/register" Component={Register} />
      <Route path="/profile" Component={Profile} />
      {/* <Route path="*" element={<Error404 />} />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/details/:type/:movieTitle/:movieId" element={<Details />} /> */}
    </Routes>
  );
};
