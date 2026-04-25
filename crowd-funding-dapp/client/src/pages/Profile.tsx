import { useEffect, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { DisplayCampaigns } from '../components'
import { useCampaigns } from '../context'

const Profile = () => {
  const account = useActiveAccount()
  const { getUserCampaigns, isLoading } = useCampaigns()
  const [campaigns, setCampaigns] = useState([] as Awaited<ReturnType<typeof getUserCampaigns>>)

  useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await getUserCampaigns()
      setCampaigns(data)
    }

    fetchCampaigns()
  }, [account, getUserCampaigns])

  return (
    <div className="page">
      {!account ? <p className="muted">Connect your wallet to view your campaigns.</p> : null}
      <DisplayCampaigns title="Your Campaigns" isLoading={isLoading} campaigns={campaigns} />
    </div>
  )
}

export default Profile
