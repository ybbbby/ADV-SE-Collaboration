async function logout() {
  try {
    await fetch('/google/logout', {
      method: 'GET',
    })
    return true
  } catch (e) {
    return false
  }
}

export default logout
