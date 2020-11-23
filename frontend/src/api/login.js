async function login() {
  try {
    const result = await fetch('/google/login', {
      method: 'GET',
    })
    const data = await result.text()
    return data
  } catch (e) {
    return null
  }
}

export default login
