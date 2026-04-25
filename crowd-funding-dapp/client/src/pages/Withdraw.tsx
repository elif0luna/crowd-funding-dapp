import { useEffect, useMemo, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { CustomButton, Loader } from '../components'
import { useCampaigns } from '../context'
import { daysLeft } from '../utils'

const Withdraw = () => {
  const account = useActiveAccount()
  const { getUserCampaigns, withdrawFunds, stopCampaign, isLoading } = useCampaigns()
  const [campaigns, setCampaigns] = useState<Awaited<ReturnType<typeof getUserCampaigns>>>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!account) {
        setCampaigns([])
        setSelectedId(null)
        return
      }

      const data = await getUserCampaigns()
      setCampaigns(data)
      if (data.length > 0 && selectedId === null) {
        setSelectedId(data[0].pId)
      }
    }

    fetchCampaigns()
  }, [account, getUserCampaigns, selectedId])

  const selectedCampaign = useMemo(() => {
    if (selectedId === null) {
      return undefined
    }

    return campaigns.find((campaign) => campaign.pId === selectedId)
  }, [campaigns, selectedId])

  if (!account) {
    return <div className="page">Connect your wallet to manage withdrawals.</div>
  }

  if (campaigns.length === 0) {
    return <div className="page">You have no campaigns yet.</div>
  }

  return (
    <div className="page">
      {isLoading ? <Loader /> : null}
      <div className="page-header">
        <h1>Withdraw</h1>
        <p>Manage active and completed campaigns, then collect the funds.</p>
      </div>

      <div className="withdraw-grid">
        <aside className="withdraw-list">
          {campaigns.map((campaign) => {
            const isActive = campaign.deadline > Math.floor(Date.now() / 1000)
            const status = campaign.claimed ? 'claimed' : isActive ? 'active' : 'ended'

            return (
              <button
                key={campaign.pId}
                type="button"
                className={`withdraw-item ${selectedId === campaign.pId ? 'active' : ''}`}
                onClick={() => setSelectedId(campaign.pId)}
              >
                <h3>{campaign.title}</h3>
                <span className={`status-pill ${status}`}>{status}</span>
              </button>
            )
          })}
        </aside>

        {selectedCampaign ? (
          <section className="withdraw-details">
            <h2>{selectedCampaign.title}</h2>
            <p>{selectedCampaign.description}</p>
            <div className="withdraw-metrics">
              <div>
                <span>Funds raised</span>
                <strong>{selectedCampaign.amountCollected} ETH</strong>
              </div>
              <div>
                <span>Days left</span>
                <strong>{daysLeft(selectedCampaign.deadline)}</strong>
              </div>
            </div>

            {selectedCampaign.claimed ? (
              <CustomButton title="Funds Collected" styles="btn-primary" isDisabled />
            ) : selectedCampaign.deadline > Math.floor(Date.now() / 1000) ? (
              <CustomButton
                title="Stop campaign and collect funds"
                styles="btn-primary"
                handleClick={() => stopCampaign(selectedCampaign.pId)}
              />
            ) : (
              <CustomButton
                title="Collect funds"
                styles="btn-primary"
                handleClick={() => withdrawFunds(selectedCampaign.pId)}
              />
            )}
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default Withdraw
