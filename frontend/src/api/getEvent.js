async function getEvent(eventID) {
  try {
    const result = await fetch(`/event/${eventID}`, {
      method: 'GET',
    })
    const data = await result.json()
    return data
  } catch (e) {
    return null
  }
}

export default getEvent
