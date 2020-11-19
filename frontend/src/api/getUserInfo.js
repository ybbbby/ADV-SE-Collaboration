async function getUserInfo() {
  try {
    const result = await fetch('/user/info', {
      method: 'GET',
    })
    const data = await result.json()
    return data
  } catch (e) {
    return null
  }
}

export default getUserInfo
