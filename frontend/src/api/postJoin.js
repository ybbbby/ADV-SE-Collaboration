async function postJoin(id, isJoin) {
  const requestForm = new FormData()
  requestForm.append('join', isJoin)
  try {
    const result = await fetch(`/user/event/${id}/join`, {
      method: 'POST',
      body: requestForm,
    })
    return result.status === 200
  } catch (e) {
    return false
  }
}

export default postJoin
