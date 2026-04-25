import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { toEther } from 'thirdweb'
import { useActiveAccount } from 'thirdweb/react'
import {
  createCampaign as createCampaignTx,
  donateToCampaign as donateToCampaignTx,
  getCampaigns as getCampaignsTx,
  getDonators as getDonatorsTx,
  stopCampaign as stopCampaignTx,
  withdrawFunds as withdrawFundsTx,
} from '../utils/contract'

export type Campaign = {
  owner: string
  title: string
  description: string
  target: string
  deadline: number
  amountCollected: string
  image: string
  pId: number
  claimed: boolean
  stopped: boolean
}

export type Donation = {
  donator: string
  donation: string
}

type CampaignForm = {
  title: string
  description: string
  target: string
  deadline: string
  image: string
}

type CampaignContextValue = {
  isLoading: boolean
  campaigns: Campaign[]
  publishCampaign: (form: CampaignForm) => Promise<void>
  getCampaigns: () => Promise<Campaign[]>
  getUserCampaigns: () => Promise<Campaign[]>
  donate: (pId: number, amount: string) => Promise<void>
  getDonations: (pId: number) => Promise<Donation[]>
  withdrawFunds: (pId: number) => Promise<void>
  stopCampaign: (pId: number) => Promise<void>
}

const CampaignContext = createContext<CampaignContextValue | undefined>(undefined)

const toBigIntSafe = (value: unknown) => {
  if (typeof value === 'bigint') {
    return value
  }

  if (typeof value === 'number') {
    return BigInt(value)
  }

  if (typeof value === 'string') {
    return BigInt(value)
  }

  if (value && typeof value === 'object' && 'hex' in (value as { hex?: string })) {
    const hexValue = (value as { hex?: string }).hex
    if (hexValue) {
      return BigInt(hexValue)
    }
  }

  return 0n
}

const mapCampaigns = (rawCampaigns: unknown[]) => {
  return rawCampaigns.map((campaign, index) => {
    if (Array.isArray(campaign)) {
      const tuple = campaign as unknown[]
      const [owner, title, description, target, deadline, amountCollected, image, , , claimed, stopped] = tuple
      const parsedTarget = toBigIntSafe(target)
      const parsedDeadline = toBigIntSafe(deadline)
      const parsedAmountCollected = toBigIntSafe(amountCollected)

      return {
        owner: String(owner ?? ''),
        title: String(title ?? ''),
        description: String(description ?? ''),
        target: toEther(parsedTarget),
        deadline: Number(parsedDeadline),
        amountCollected: toEther(parsedAmountCollected),
        image: String(image ?? ''),
        pId: index,
        claimed: Boolean(claimed),
        stopped: Boolean(stopped),
      }
    }

    const item = campaign as {
      owner: string
      title: string
      description: string
      target: unknown
      deadline: unknown
      amountCollected: unknown
      image: string
      claimed: boolean
      stopped: boolean
    }

    const target = toBigIntSafe(item.target)
    const deadline = toBigIntSafe(item.deadline)
    const amountCollected = toBigIntSafe(item.amountCollected)

    return {
      owner: item.owner,
      title: item.title,
      description: item.description,
      target: toEther(target),
      deadline: Number(deadline),
      amountCollected: toEther(amountCollected),
      image: item.image,
      pId: index,
      claimed: item.claimed,
      stopped: item.stopped,
    }
  })
}

export const CampaignsProvider = ({ children }: { children: React.ReactNode }) => {
  const account = useActiveAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const getCampaigns = useCallback(async () => {
    try {
      const data = await getCampaignsTx()
      const mapped = mapCampaigns(data as unknown[])
      setCampaigns(mapped)
      return mapped
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
      return []
    }
  }, [])

  const publishCampaign = useCallback(
    async (form: CampaignForm) => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      setIsLoading(true)
      try {
        await createCampaignTx(
          account,
          form.title,
          form.description,
          form.target,
          Number(form.deadline),
          form.image,
        )
        await getCampaigns()
      } finally {
        setIsLoading(false)
      }
    },
    [account, getCampaigns],
  )

  const getUserCampaigns = useCallback(async () => {
    const all = await getCampaigns()
    if (!account) {
      return []
    }

    return all.filter((campaign) => {
      if (!campaign.owner) {
        return false
      }

      return campaign.owner.toLowerCase() === account.address.toLowerCase()
    })
  }, [account, getCampaigns])

  const donate = useCallback(
    async (pId: number, amount: string) => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      setIsLoading(true)
      try {
        await donateToCampaignTx(account, pId, amount)
        await getCampaigns()
      } finally {
        setIsLoading(false)
      }
    },
    [account, getCampaigns],
  )

  const getDonations = useCallback(async (pId: number) => {
    try {
      const data = await getDonatorsTx(pId)
      const [donators, donations] = data as [string[], unknown[]]

      return donators.map((donator, index) => ({
        donator,
        donation: toEther(toBigIntSafe(donations[index])),
      }))
    } catch (error) {
      console.error('Failed to fetch donations:', error)
      return []
    }
  }, [])

  const withdrawFunds = useCallback(
    async (pId: number) => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      setIsLoading(true)
      try {
        await withdrawFundsTx(account, pId)
        await getCampaigns()
      } finally {
        setIsLoading(false)
      }
    },
    [account, getCampaigns],
  )

  const stopCampaign = useCallback(
    async (pId: number) => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      setIsLoading(true)
      try {
        await stopCampaignTx(account, pId)
        await getCampaigns()
      } finally {
        setIsLoading(false)
      }
    },
    [account, getCampaigns],
  )

  const value = useMemo(
    () => ({
      isLoading,
      campaigns,
      publishCampaign,
      getCampaigns,
      getUserCampaigns,
      donate,
      getDonations,
      withdrawFunds,
      stopCampaign,
    }),
    [
      campaigns,
      donate,
      getCampaigns,
      getDonations,
      getUserCampaigns,
      isLoading,
      publishCampaign,
      stopCampaign,
      withdrawFunds,
    ],
  )

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>
}

export const useCampaigns = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error('useCampaigns must be used within CampaignsProvider')
  }

  return context
}
