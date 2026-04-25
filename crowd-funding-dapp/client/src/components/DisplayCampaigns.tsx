import FundCard from './FundCard'
import Loader from './Loader'
import type { Campaign } from '../context'
import { useNavigate } from 'react-router-dom'

type DisplayCampaignsProps = {
  title: string
  isLoading: boolean
  campaigns: Campaign[]
}

const DisplayCampaigns = ({ title, isLoading, campaigns }: DisplayCampaignsProps) => {
  const navigate = useNavigate()

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className="campaigns-section">
      <h2>{title}</h2>
      <div className="campaigns-grid">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <FundCard
              key={`${campaign.pId}-${campaign.owner}`}
              {...campaign}
              handleClick={() => navigate(`/campaign-details/${campaign.pId}`)}
            />
          ))
        ) : (
          <p className="empty-message">No campaigns yet. Be the first to launch one.</p>
        )}
      </div>
    </section>
  )
}

export default DisplayCampaigns
