import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThirdwebProvider } from 'thirdweb/react'
import App from './App.tsx'
import './index.css'
import { CampaignsProvider } from './context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <CampaignsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CampaignsProvider>
    </ThirdwebProvider>
  </React.StrictMode>,
)
