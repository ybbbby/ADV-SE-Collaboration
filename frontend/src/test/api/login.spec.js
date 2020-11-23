/* eslint-env jest */
import login from '../../api/login'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test login api', () => {
  it('should return login url', () => {
    fetch.mockResponseOnce(
      'https://accounts.google.com/o/oauth2/v2/auth/kjhakd'
    )
    login().then((data) => {
      expect(data).toBeDefined()
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))

    login().then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/google/login', { method: 'GET' })
    })
  })
})
