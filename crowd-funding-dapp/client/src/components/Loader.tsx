import { loader } from '../assets'

const Loader = () => {
  return (
    <div className="loader">
      <img src={loader} alt="Loading" className="loader-image" />
      <p>Processing transaction...</p>
    </div>
  )
}

export default Loader
