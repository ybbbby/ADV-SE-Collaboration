async function getEventsNearby(position, radius) {
  try {
    const result = await fetch(
      `/events/nearby?radius=${radius}&pos=${position}`,
      {
        method: 'GET',
      }
    )
    const data = await result.json()
    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

export default getEventsNearby
