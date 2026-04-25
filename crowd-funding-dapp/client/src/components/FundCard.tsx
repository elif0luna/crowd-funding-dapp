import { money } from '../assets'
import { calculateBarPercentage, daysLeft } from '../utils'

type FundCardProps = {
  owner: string
  title: string
  description: string
  target: string
  deadline: number
  amountCollected: string
  image: string
  claimed: boolean
  handleClick?: () => void
}

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, claimed, handleClick }: FundCardProps) => {
  const remainingDays = daysLeft(deadline)
  const progress = calculateBarPercentage(Number(target), Number(amountCollected))
  const status = claimed ? 'claimed' : remainingDays === 0 ? 'ended' : 'active'

  return (
    <button type="button" className="fund-card" onClick={handleClick}>
      <img src={image} alt={title} className="fund-card-image" />
      <div className="fund-card-body">
        <span className={`status-pill ${status}`}>{status}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="fund-progress">
          <div className="fund-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="fund-stats">
          <div>
            <h4>{amountCollected}</h4>
            <span>raised of {target} ETH</span>
          </div>
          <div>
            <h4>{remainingDays}</h4>
            <span>days left</span>
          </div>
        </div>
        <div className="fund-owner">
          <img src={money} alt="owner" />
          <p>{owner.slice(0, 6)}...{owner.slice(-4)}</p>
        </div>
      </div>
    </button>
  )
}

export default FundCard
