/* eslint-env jest */
import postEvent from '../../api/postEvent'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test postEvent api', () => {
  it('should load events data', () => {
    fetch.mockResponseOnce('12345')
    postEvent(new FormData()).then((data) => {
      expect(data).toEqual('12345')
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    postEvent(new FormData()).then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/event', {
        method: 'POST',
        body: new FormData(),
      })
    })
  })
})
