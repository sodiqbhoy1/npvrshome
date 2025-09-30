import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    {/* Global toast container */}
    <Toaster position="top-right" toastOptions={{
      success: { duration: 3000 },
      error: { duration: 4000 }
    }} />
    </BrowserRouter>
  </StrictMode>,
)
