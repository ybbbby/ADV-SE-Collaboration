/* eslint-env jest */
import postLike from '../../api/postLike'
import mockLike from '../__mockData__/like'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test postLike api', () => {
  it('returns true when operating successfully', () => {
    fetch.mockResponseOnce(JSON.stringify(mockLike))
    postLike(12352, true).then((data) => {
      expect(data).toEqual(true)
    })
  })

  it('returns false when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    const requestForm = new FormData()
    requestForm.append('like', false)
    postLike(23145, false).then((data) => {
      expect(data).toEqual(false)
      expect(fetch).toHaveBeenCalledWith('/user/event/23145/like', {
        method: 'POST',
        body: requestForm,
      })
    })
  })
})
