async function updateEvent(eventId, requestForm) {
  try {
    const result = await fetch(`/event/` + eventId, {
      method: 'POST',
      body: requestForm,
    })
    const data = await result.text()
    return data
  } catch (e) {
    return null
  }
}

export default updateEvent
