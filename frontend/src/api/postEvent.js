async function postEvent(requestForm) {
  try {
    const result = await fetch(`/event`, {
      method: 'POST',
      body: requestForm,
    })
    const data = await result.text()
    return data
  } catch (e) {
    return null
  }
}

export default postEvent
