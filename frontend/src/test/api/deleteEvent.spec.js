/* eslint-env jest */
import deleteEvent from '../../api/deleteEvent'
import mockDelete from '../__mockData__/deleteEvent'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test deleteEvent api', () => {
  it('returns true when operating successfully', () => {
    fetch.mockResponseOnce(JSON.stringify(mockDelete))
    deleteEvent(12352).then((data) => {
      expect(data).toEqual(true)
    })
  })

  it('returns false when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    deleteEvent(23145).then((data) => {
      expect(data).toEqual(false)
      expect(fetch).toHaveBeenCalledWith('/event/23145', {
        method: 'DELETE',
      })
    })
  })
})
