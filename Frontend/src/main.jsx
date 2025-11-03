import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import AuthProvider from "./context/AuthProvider.jsx";  
import { Toaster } from 'react-hot-toast'   // ✅ add this import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" reverseOrder={false} /> {/* ✅ place globally */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
