async function getEventAttendees(eventID) {
  try {
    const result = await fetch(`/event/${eventID}/attendees`, {
      method: 'GET',
    })
    const data = await result.json()
    return data
  } catch (e) {
    return null
  }
}

export default getEventAttendees
