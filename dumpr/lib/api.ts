import type { TokenBalance, NetworkConfig, GasTokenBalance } from "@/types/api"

export function formatTokenValue(value: string, decimals: string | null): string {
  if (!value || !decimals) return "0"

  try {
    const parsedValue = Number.parseFloat(value)
    const parsedDecimals = Number.parseInt(decimals)

    if (isNaN(parsedValue) || isNaN(parsedDecimals)) return "0"

    const formattedValue = parsedValue / Math.pow(10, parsedDecimals)
    return formattedValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    })
  } catch {
    return "0"
  }
}

export function calculateUSDValue(value: string, decimals: string | null, exchangeRate?: string): string {
  if (!value || !decimals || !exchangeRate) return "$0.00"

  try {
    const tokenAmount = Number.parseFloat(value) / Math.pow(10, Number.parseInt(decimals))
    const rate = Number.parseFloat(exchangeRate)

    if (isNaN(tokenAmount) || isNaN(rate)) return "$0.00"

    const usdValue = tokenAmount * rate
    return usdValue.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch {
    return "$0.00"
  }
}

export function calculateTotalUSDValue(tokens: TokenBalance[]): string {
  const total = tokens.reduce((sum, token) => {
    const usdValue = Number.parseFloat(
      calculateUSDValue(token.value, token.token.decimals, token.token.exchange_rate).replace("$", ""),
    )
    return sum + (isNaN(usdValue) ? 0 : usdValue)
  }, 0)

  return total.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export async function fetchTokenBalances(network: NetworkConfig, address: string): Promise<TokenBalance[]> {
  try {
    const response = await fetch(`${network.endpoint}/api/v2/addresses/${address}/token-balances`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (response.status === 404) {
      console.log(`No tokens found for address ${address} on ${network.name}`)
      return []
    }

    if (!response.ok) {
      console.error(`API error for ${network.name}: ${response.status}`)
      return []
    }

    const data = await response.json()

    return (data || []).filter((item: TokenBalance) => {
      return item && item.token && item.token.symbol && item.value && Number.parseFloat(item.value) > 0
    })
  } catch (error) {
    console.error(`Error fetching token balances for ${network.name}:`, error)
    return []
  }
}

export async function fetchGasTokenBalance(network: NetworkConfig, address: string): Promise<GasTokenBalance | null> {
  try {
    const response = await fetch(`${network.endpoint}/api/v2/addresses/${address}`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error(`API error for ${network.name} gas balance: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (!data.coin_balance || !data.exchange_rate) {
      console.error(`Invalid data for ${network.name} gas balance`)
      return null
    }

    const balance = Number.parseFloat(data.coin_balance)
    const exchangeRate = Number.parseFloat(data.exchange_rate)
    const usdBalance = balance * exchangeRate * 0.000000000000000001 // Convert only USD value to ETH scale

    return {
      balance: balance.toString(),
      usdBalance: usdBalance.toFixed(2),
      symbol: network.gasSymbol || "GAS",
    }
  } catch (error) {
    console.error(`Error fetching gas balance for ${network.name}:`, error)
    return null
  }
}

export async function fetchAllGasTokenBalances(networks: NetworkConfig[], address: string) {
  if (!address || !networks.length) return {}

  const promises = networks.map((network) => fetchGasTokenBalance(network, address))
  const results = await Promise.allSettled(promises)

  return results.reduce(
    (acc, result, index) => {
      if (result.status === "fulfilled" && result.value) {
        acc[networks[index].id] = result.value
      }
      return acc
    },
    {} as Record<string, GasTokenBalance>,
  )
}

export async function fetchAllTokenBalances(networks: NetworkConfig[], address: string) {
  if (!address || !networks.length) return { tokens: {}, gasBalances: {} }

  const tokenPromises = networks.map((network) => fetchTokenBalances(network, address))
  const gasPromises = networks.map((network) => fetchGasTokenBalance(network, address))

  const [tokenResults, gasResults] = await Promise.all([
    Promise.allSettled(tokenPromises),
    Promise.allSettled(gasPromises),
  ])

  const tokens = tokenResults.reduce(
    (acc, result, index) => {
      if (result.status === "fulfilled") {
        acc[networks[index].id] = result.value
      } else {
        acc[networks[index].id] = []
      }
      return acc
    },
    {} as Record<string, TokenBalance[]>,
  )

  const gasBalances = gasResults.reduce(
    (acc, result, index) => {
      if (result.status === "fulfilled" && result.value) {
        acc[networks[index].id] = result.value
      }
      return acc
    },
    {} as Record<string, GasTokenBalance>,
  )

  return { tokens, gasBalances }
}

