async function postLike(id, isLike) {
  const requestForm = new FormData()
  requestForm.append('like', isLike)
  try {
    const result = await fetch(`/user/event/${id}/like`, {
      method: 'POST',
      body: requestForm,
    })
    return result.status === 200
  } catch (e) {
    return false
  }
}

export default postLike
