/* eslint-env jest */
import getEventsNearby from '../../api/getEventsNearby'
import mockEvents from './__mockData__/events'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test getEvents api', () => {
  it('should load events data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    getEventsNearby('40.769830,-73.985857').then((data) => {
      expect(data).toBeDefined()
      expect(data[0].author).toEqual('Minxuan Gao')
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))

    getEventsNearby('40.769830,-73.985857').then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith(
        '/events/nearby?pos=40.769830,-73.985857',
        {
          method: 'GET',
        }
      )
    })
  })
})
