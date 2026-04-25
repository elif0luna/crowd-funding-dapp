import { useEffect, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useCampaigns } from '../context'

type PaymentEntry = {
  campaignTitle: string
  amount: string
  from: string
  to: string
}

const Payments = () => {
  const account = useActiveAccount()
  const { getCampaigns, getDonations, isLoading } = useCampaigns()
  const [incoming, setIncoming] = useState<PaymentEntry[]>([])
  const [outgoing, setOutgoing] = useState<PaymentEntry[]>([])

  useEffect(() => {
    const fetchPayments = async () => {
      if (!account) {
        setIncoming([])
        setOutgoing([])
        return
      }

      const lowerAddress = account.address.toLowerCase()
      const campaigns = await getCampaigns()
      const donationsByCampaign = await Promise.all(
        campaigns.map(async (campaign) => ({
          campaign,
          donations: await getDonations(campaign.pId),
        })),
      )

      const incomingPayments: PaymentEntry[] = []
      const outgoingPayments: PaymentEntry[] = []

      donationsByCampaign.forEach(({ campaign, donations }) => {
        donations.forEach((donation) => {
          const entry: PaymentEntry = {
            campaignTitle: campaign.title,
            amount: donation.donation,
            from: donation.donator,
            to: campaign.owner,
          }

          if (campaign.owner.toLowerCase() === lowerAddress) {
            incomingPayments.push(entry)
          }

          if (donation.donator.toLowerCase() === lowerAddress) {
            outgoingPayments.push(entry)
          }
        })
      })

      setIncoming(incomingPayments)
      setOutgoing(outgoingPayments)
    }

    fetchPayments()
  }, [account, getCampaigns, getDonations])

  if (!account) {
    return <div className="page">Connect your wallet to view payments.</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Payments</h1>
        <p>Track incoming donations to your campaigns and your outgoing contributions.</p>
      </div>

      <div className="payments-grid">
        <section className="payments-card">
          <h2>Incoming to your campaigns</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : incoming.length > 0 ? (
            <ul>
              {incoming.map((payment, index) => (
                <li key={`${payment.from}-${payment.campaignTitle}-${index}`}>
                  <div>
                    <strong>{payment.campaignTitle}</strong>
                    <span>from {payment.from}</span>
                  </div>
                  <p>{payment.amount} ETH</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No incoming payments yet.</p>
          )}
        </section>

        <section className="payments-card">
          <h2>Your outgoing donations</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : outgoing.length > 0 ? (
            <ul>
              {outgoing.map((payment, index) => (
                <li key={`${payment.to}-${payment.campaignTitle}-${index}`}>
                  <div>
                    <strong>{payment.campaignTitle}</strong>
                    <span>to {payment.to}</span>
                  </div>
                  <p>{payment.amount} ETH</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No outgoing donations yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default Payments
