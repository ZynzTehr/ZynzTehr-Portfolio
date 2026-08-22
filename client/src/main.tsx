import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/global.css';
import './styles/global.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx';

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
