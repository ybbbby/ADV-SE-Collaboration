async function getEvents(category) {
  try {
    const result = await fetch(`/events/${category}`, {
      method: 'GET',
    })
    const data = await result.json()
    return data
  } catch (e) {
    return null
  }
}

export default getEvents
