import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CountBox, CustomButton, FormField, Loader } from '../components'
import { useCampaigns } from '../context'
import { daysLeft } from '../utils'


const CampaignDetails = () => {
  const { id } = useParams()
  const { campaigns, getCampaigns, donate, getDonations, isLoading } = useCampaigns()
  const [amount, setAmount] = useState('')
  const [donations, setDonations] = useState<{ donator: string; donation: string }[]>([])

  useEffect(() => {
    getCampaigns()
  }, [getCampaigns])

  const campaign = useMemo(() => {
    const index = Number(id)
    return campaigns.find((item) => item.pId === index)
  }, [campaigns, id])

  useEffect(() => {
    const fetchDonations = async () => {
      if (!campaign) {
        return
      }

      const data = await getDonations(campaign.pId)
      setDonations(data)
    }

    fetchDonations()
  }, [campaign, getDonations])

  if (!campaign) {
    return <div className="page">Campaign not found.</div>
  }

  const remainingDays = daysLeft(campaign.deadline)
  const isActive = campaign.deadline > Math.floor(Date.now() / 1000) && !campaign.claimed

  const handleDonate = async () => {
    await donate(campaign.pId, amount)
    setAmount('')
    const data = await getDonations(campaign.pId)
    setDonations(data)
  }

  return (
    <div className="page">
      {isLoading ? <Loader /> : null}
      <div className="details-hero">
        <img src={campaign.image} alt={campaign.title} />
        <div>
          <h1>{campaign.title}</h1>
          <p>{campaign.description}</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-stats">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title="Raised (ETH)" value={campaign.amountCollected} />
          <CountBox title="Backers" value={donations.length} />
        </div>

        <div className="details-action">
          <h3>Back this campaign</h3>
          {!isActive ? <p className="muted">Campaign is no longer accepting donations.</p> : null}
          <FormField
            labelName="Amount (ETH)"
            placeholder="0.05"
            inputType="number"
            value={amount}
            handleChange={(event) => setAmount(event.target.value)}
          />
          <CustomButton title="Fund Campaign" styles="btn-primary" handleClick={handleDonate} isDisabled={!isActive} />
        </div>
      </div>

      <section className="donation-list">
        <h3>Donations</h3>
        {donations.length > 0 ? (
          <ul>
            {donations.map((donation, index) => (
              <li key={`${donation.donator}-${index}`}>
                <span>{donation.donator}</span>
                <strong>{donation.donation} ETH</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No donations yet. Be the first supporter.</p>
        )}
      </section>
    </div>
  )
}

export default CampaignDetails
