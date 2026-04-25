export const daysLeft = (deadline: number) => {
  const now = Math.floor(Date.now() / 1000)
  const remaining = deadline - now
  if (remaining <= 0) {
    return 0
  }

  return Math.ceil(remaining / (60 * 60 * 24))
}

export const calculateBarPercentage = (goal: number, raisedAmount: number) => {
  if (goal <= 0) {
    return 0
  }

  const percentage = (raisedAmount * 100) / goal
  return Math.min(Math.max(percentage, 0), 100)
}

export const checkIfImage = (url: string, callback: (isValid: boolean) => void) => {
  const img = new Image()
  img.src = url

  if (img.complete) {
    callback(true)
    return
  }

  img.onload = () => callback(true)
  img.onerror = () => callback(false)
}
