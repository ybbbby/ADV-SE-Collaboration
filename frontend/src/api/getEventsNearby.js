async function getEventsNearby(position) {
  try {
    const result = await fetch(`/events/nearby?pos=${position}`, {
      method: 'GET',
    })
    const data = await result.json()
    return data
  } catch (e) {
    return null
  }
}

export default getEventsNearby
