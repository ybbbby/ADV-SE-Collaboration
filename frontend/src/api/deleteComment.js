async function deleteComment(id) {
  try {
    const result = await fetch(`/comment/${id}`, {
      method: 'DELETE',
    })
    return result.status === 200
  } catch (e) {
    return false
  }
}

export default deleteComment
