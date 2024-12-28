import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { WebSocketProvider } from './components/WebSocketContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <WebSocketProvider url="wss://localhost:7199/ws/can">
            <App />
        </WebSocketProvider>
  </StrictMode>,
)
