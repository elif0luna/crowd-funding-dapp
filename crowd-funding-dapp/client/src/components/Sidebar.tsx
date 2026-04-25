import { NavLink, useNavigate } from 'react-router-dom'
import { navlinks } from '../constants'
import { logo, thirdweb } from '../assets'
import { useDisconnect } from 'thirdweb/react'

const Sidebar = () => {
  const navigate = useNavigate()
  const { disconnect } = useDisconnect()

  const handleNavClick = async (link: string, name: string) => {
    if (name === 'logout') {
      disconnect()
      navigate('/')
      return
    }

    navigate(link)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="CrowdFund" />
      </div>
      <nav className="sidebar-links">
        {navlinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.link}
            className="sidebar-link"
            onClick={(event) => {
              event.preventDefault()
              handleNavClick(link.link, link.name)
            }}
          >
            <img src={link.imgUrl} alt={link.name} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <img src={thirdweb} alt="thirdweb" />
        <p>Powered by thirdweb</p>
      </div>
      <NavLink to="/create-campaign" className="sidebar-cta">
        Launch Campaign
      </NavLink>
    </aside>
  )
}

export default Sidebar
