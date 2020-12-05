async function getUserInfo() {
  try {
    const result = await fetch('/user/info', {
      method: 'GET',
    })
    const data = await result.json()
    if (data === 'NOUSER') return null
    return data
  } catch (e) {
    return null
  }
}

export default getUserInfo
