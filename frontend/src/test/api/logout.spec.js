/* eslint-env jest */
import logout from '../../api/logout'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test logout api', () => {
  it('should return true if logout successfully', () => {
    fetch.mockResponseOnce('')
    logout().then((data) => {
      expect(data).toEqual(true)
    })
  })

  it('returns false when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))

    logout().then((data) => {
      expect(data).toEqual(false)
      expect(fetch).toHaveBeenCalledWith('/google/logout', { method: 'GET' })
    })
  })
})
