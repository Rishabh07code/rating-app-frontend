import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { StoreProvider } from './context/StoreContext'
import { AdminProvider } from './context/AdminContext'
import { OwnerProvider } from './context/OwnerContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <AdminProvider>
            <OwnerProvider>
              <App />
            </OwnerProvider>
          </AdminProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
