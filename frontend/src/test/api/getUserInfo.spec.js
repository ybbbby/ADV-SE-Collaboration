/* eslint-env jest */
import getUserInfo from '../../api/getUserInfo'
import mockUser from '../__mockData__/userInfo'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test getUserInfo api', () => {
  it('should load user data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockUser))
    getUserInfo().then((data) => {
      expect(data).toBeDefined()
      expect(data.name).toEqual('Minxuan Gao')
      expect(data.email).toEqual('mg4115@columbia.edu')
    })
  })

  it('returns null when NOUSER', () => {
    fetch.mockResponseOnce(JSON.stringify('NOUSER'))
    getUserInfo().then((data) => {
      expect(data).toEqual(null)
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))

    getUserInfo().then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/user/info', { method: 'GET' })
    })
  })
})
