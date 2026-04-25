import { createThirdwebClient, getContract, prepareContractCall, readContract, sendTransaction, toWei } from 'thirdweb'
import { sepolia } from 'thirdweb/chains'
import type { Account } from 'thirdweb/wallets'

export const CONTRACT_ADDRESSES = {
  CrowdFunding: '0x63D0BAAe8d76aEDB0d221CC8E6397C010c8dD448',
}

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID
const thirdwebSecretKey = import.meta.env.VITE_THIRDWEB_SECRET_KEY
const debugThirdweb = import.meta.env.VITE_DEBUG_THIRDWEB === 'true'

if (!clientId) {
  throw new Error('Missing VITE_THIRDWEB_CLIENT_ID in environment')
}

if (!thirdwebSecretKey) {
  console.warn('Missing VITE_THIRDWEB_SECRET_KEY. Read calls may fail if SDK reads are unreliable.')
}

export const thirdwebClient = createThirdwebClient({ clientId })
export const crowdFundingContract = getContract({
  client: thirdwebClient,
  chain: sepolia,
  address: CONTRACT_ADDRESSES.CrowdFunding,
})

const THIRDWEB_READ_ENDPOINT = 'https://api.thirdweb.com/v1/contracts/read'

const extractResult = (value: unknown) => {
  if (!value) {
    return undefined
  }

  if (Array.isArray(value)) {
    const first = value[0] as { result?: unknown; data?: unknown }
    return first?.result ?? first?.data
  }

  if (typeof value === 'object' && 'result' in (value as { result?: unknown })) {
    return (value as { result?: unknown }).result
  }

  if (typeof value === 'object' && 'data' in (value as { data?: unknown })) {
    const inner = (value as { data?: unknown }).data
    if (Array.isArray(inner)) {
      return inner
    }
    if (inner && typeof inner === 'object' && 'result' in (inner as { result?: unknown })) {
      return (inner as { result?: unknown }).result
    }
  }

  return undefined
}

const parseThirdwebResult = (data: unknown) => {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  const payload = data as {
    result?: unknown
    results?: unknown
    error?: unknown
    data?: unknown
  }

  if (payload.error) {
    return undefined
  }

  if (payload.data && typeof payload.data === 'object') {
    const dataPayload = payload.data as { result?: unknown; results?: unknown; data?: unknown }
    return extractResult(dataPayload.result ?? dataPayload.results ?? dataPayload.data)
  }

  return extractResult(payload.result ?? payload.results) ?? payload.result
}

const readContractViaApi = async (method: string, params: unknown[]) => {
  if (!thirdwebSecretKey) {
    return undefined
  }

  const body = {
    calls: [
      {
        contractAddress: CONTRACT_ADDRESSES.CrowdFunding,
        method,
        params,
      },
    ],
    chainId: 11155111,
  }

  if (debugThirdweb) {
    console.info('[thirdweb][read] request', body)
  }

  const response = await fetch(THIRDWEB_READ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-secret-key': thirdwebSecretKey,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    if (debugThirdweb) {
      console.warn('[thirdweb][read] http error', response.status)
    }
    return undefined
  }

  const data = await response.json()
  if (debugThirdweb) {
    console.info('[thirdweb][read] response', data)
  }
  return parseThirdwebResult(data)
}

export const createCampaign = async (
  account: Account,
  title: string,
  description: string,
  targetAmountEth: string,
  deadlineDays: number,
  image: string,
) => {
  try {
    const deadline = Math.floor(Date.now() / 1000) + deadlineDays * 24 * 60 * 60
    const transaction = prepareContractCall({
      contract: crowdFundingContract,
      method: 'function createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image)',
      params: [account.address, title, description, toWei(targetAmountEth), BigInt(deadline), image],
    })

    return await sendTransaction({ account, transaction })
  } catch (error) {
    console.error('Failed to create campaign:', error)
    throw error
  }
}

export const donateToCampaign = async (account: Account, campaignId: number, amountEth: string) => {
  try {
    const transaction = prepareContractCall({
      contract: crowdFundingContract,
      method: 'function donateToCampaign(uint256 _id) payable',
      params: [BigInt(campaignId)],
      value: toWei(amountEth),
    })

    return await sendTransaction({ account, transaction })
  } catch (error) {
    console.error('Failed to donate:', error)
    throw error
  }
}

export const getCampaign = async (campaignId: number) => {
  try {
    const campaigns = await getCampaigns()
    const list = campaigns as unknown[]
    return list[campaignId]
  } catch (error) {
    console.error('Failed to get campaign:', error)
    throw error
  }
}

export const getNumberOfCampaigns = async () => {
  try {
    const apiResult = await readContractViaApi('function numberOfCampaigns() view returns (uint256)', [])

    if (apiResult !== undefined) {
      return BigInt(apiResult as string).toString()
    }

    const count = await readContract({
      contract: crowdFundingContract,
      method: 'function numberOfCampaigns() view returns (uint256)',
      params: [],
    })

    return (count as bigint).toString()
  } catch (error) {
    console.error('Failed to get campaign count:', error)
    throw error
  }
}

export const getCampaigns = async () => {
  try {
    const apiResult = await readContractViaApi(
      'function getCampaigns() view returns ((address,string,string,uint256,uint256,uint256,string,address[],uint256[],bool,bool)[])',
      [],
    )

    if (Array.isArray(apiResult)) {
      return apiResult
    }

    return await readContract({
      contract: crowdFundingContract,
      method: 'function getCampaigns() view returns ((address,string,string,uint256,uint256,uint256,string,address[],uint256[],bool,bool)[])',
      params: [],
    })
  } catch (error) {
    console.error('Failed to get campaigns:', error)
    throw error
  }
}

export const getDonators = async (campaignId: number) => {
  try {
    const apiResult = await readContractViaApi(
      'function getDonators(uint256 _id) view returns (address[], uint256[])',
      [campaignId],
    )

    if (apiResult !== undefined) {
      return apiResult
    }

    return await readContract({
      contract: crowdFundingContract,
      method: 'function getDonators(uint256 _id) view returns (address[] , uint256[] )',
      params: [BigInt(campaignId)],
    })
  } catch (error) {
    console.error('Failed to get donators:', error)
    throw error
  }
}

export const withdrawFunds = async (account: Account, campaignId: number) => {
  try {
    const transaction = prepareContractCall({
      contract: crowdFundingContract,
      method: 'function withdrawFunds(uint256 _id)',
      params: [BigInt(campaignId)],
    })

    return await sendTransaction({ account, transaction })
  } catch (error) {
    console.error('Failed to withdraw funds:', error)
    throw error
  }
}

export const stopCampaign = async (account: Account, campaignId: number) => {
  try {
    const transaction = prepareContractCall({
      contract: crowdFundingContract,
      method: 'function stopCampaign(uint256 _id)',
      params: [BigInt(campaignId)],
    })

    return await sendTransaction({ account, transaction })
  } catch (error) {
    console.error('Failed to stop campaign:', error)
    throw error
  }
}
