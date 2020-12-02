/* eslint-env jest */
import postComment from '../../api/postComment'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test postComment api', () => {
  it('should load events data', () => {
    fetch.mockResponseOnce('12345')
    postComment(123, new FormData()).then((data) => {
      expect(data).toEqual('12345')
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    postComment(123, new FormData()).then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/user/event/123/comment', {
        method: 'POST',
        body: new FormData(),
      })
    })
  })
})
