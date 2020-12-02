async function postComment(eventId, requestForm) {
  try {
    const result = await fetch(`/user/event/` + eventId + `/comment`, {
      method: 'POST',
      body: requestForm,
    })
    const data = await result.text()
    return data
  } catch (e) {
    return null
  }
}

export default postComment
