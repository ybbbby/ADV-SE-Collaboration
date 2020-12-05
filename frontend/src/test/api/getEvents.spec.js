/* eslint-env jest */
import getEvents from '../../api/getEvents'
import mockEvents from '../__mockData__/events'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test getEvents api', () => {
  it('should load events data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    getEvents('history').then((data) => {
      expect(data).toBeDefined()
      expect(data[0].author).toEqual('test user1')
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))

    getEvents('history').then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/events/history', { method: 'GET' })
    })
  })
})
