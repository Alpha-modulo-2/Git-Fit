import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import { Router } from './routes';

export const App = () => (
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
