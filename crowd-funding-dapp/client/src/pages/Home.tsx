import { useEffect, useMemo, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { DisplayCampaigns } from '../components'
import { useCampaigns } from '../context'

const workflows = [
  {
    title: 'Create Campaign Flow',
    description: 'Launch a campaign, submit metadata, and sign with your wallet to publish on-chain.',
  },
  {
    title: 'Fund-Tier Logic',
    description: 'Backers contribute with flexible amounts while the UI tracks progress in real time.',
  },
  {
    title: 'Campaign Lifecycle',
    description: 'Active, funded, and completed states are derived from deadlines and target totals.',
  },
  {
    title: 'Contract Data Flow',
    description: 'Reads pull from thirdweb contract calls and writes submit through prepared txs.',
  },
  {
    title: 'CI-Contracts Workflow',
    description: 'Deployment outputs feed the client through addresses and ABI consistency.',
  },
]

const Home = () => {
  const account = useActiveAccount()
  const { campaigns, isLoading, getCampaigns, getUserCampaigns } = useCampaigns()
  const [userCampaigns, setUserCampaigns] = useState([] as Awaited<ReturnType<typeof getUserCampaigns>>)

  useEffect(() => {
    getCampaigns()
  }, [getCampaigns])

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      if (!account) {
        setUserCampaigns([])
        return
      }

      const data = await getUserCampaigns()
      setUserCampaigns(data)
    }

    fetchUserCampaigns()
  }, [account, getUserCampaigns])

  const activeCampaigns = useMemo(() => {
    const now = Math.floor(Date.now() / 1000)
    return campaigns.filter((campaign) => campaign.deadline > now && !campaign.claimed)
  }, [campaigns])

  return (
    <div className="page">
      <section className="workflow">
        <h2>System Workflows</h2>
        <div className="workflow-grid">
          {workflows.map((flow) => (
            <div key={flow.title} className="workflow-card">
              <h3>{flow.title}</h3>
              <p>{flow.description}</p>
            </div>
          ))}
        </div>
      </section>

      <DisplayCampaigns title="Active Campaigns" isLoading={isLoading} campaigns={activeCampaigns} />
      <DisplayCampaigns title="Your Campaigns" isLoading={isLoading} campaigns={userCampaigns} />
    </div>
  )
}

export default Home
