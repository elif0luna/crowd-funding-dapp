import { Route, Routes } from 'react-router-dom'
import { Navbar, Sidebar } from './components'
import { CampaignDetails, CreateCampaign, Home, Payments, Profile, Withdraw } from './pages'
import './App.css'

const App = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payments />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/logout" element={<div className="page">You are signed out.</div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
