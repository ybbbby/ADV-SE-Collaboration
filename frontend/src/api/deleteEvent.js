async function deleteEvent(id) {
  try {
    const result = await fetch(`/event/${id}`, {
      method: 'DELETE',
    })
    return result.status === 200
  } catch (e) {
    return false
  }
}

export default deleteEvent
