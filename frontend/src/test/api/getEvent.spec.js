/* eslint-env jest */
import getEvent from '../../api/getEvent'
import mockEvent from '../__mockData__/event'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test getEvent api', () => {
  it('should load event data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    getEvent('1605497505188481').then((data) => {
      expect(data).toBeDefined()
      expect(data.description).toEqual('22211')
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))

    getEvent('1605497505188481').then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/event/1605497505188481', {
        method: 'GET',
      })
    })
  })
})
