import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSecurityShield } from './utils/securityShield'

// Activate F12 blocker, right click blocker, and anti-inspection protection
initSecurityShield();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
