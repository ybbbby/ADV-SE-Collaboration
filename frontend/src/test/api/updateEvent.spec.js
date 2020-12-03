/* eslint-env jest */
import updateEvent from '../../api/updateEvent'
import mockupdate from './__mockData__/update'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test updateEvent api', () => {
  it('should load events data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockupdate))
    updateEvent(123, new FormData()).then((data) => {
      expect(data).toEqual(true)
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    updateEvent(123, new FormData()).then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/event/123', {
        method: 'POST',
        body: new FormData(),
      })
    })
  })
})
