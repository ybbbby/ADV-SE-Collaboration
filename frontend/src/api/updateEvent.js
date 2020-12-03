async function updateEvent(eventId, requestForm) {
  try {
    const result = await fetch(`/event/` + eventId, {
      method: 'POST',
      body: requestForm,
    })
    return result.status === 200
  } catch (e) {
    return null
  }
}

export default updateEvent
