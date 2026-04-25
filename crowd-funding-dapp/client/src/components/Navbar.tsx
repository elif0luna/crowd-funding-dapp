import { search } from '../assets'
import { thirdwebClient } from '../utils/contract'
import { ConnectButton } from 'thirdweb/react'
import { sepolia } from 'thirdweb/chains'

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-search">
        <img src={search} alt="search" />
        <input type="text" placeholder="Search campaigns" />
      </div>
      <div className="navbar-actions">
        <ConnectButton client={thirdwebClient} chain={sepolia} />
      </div>
    </header>
  )
}

export default Navbar
