/* eslint-env jest */
import getEventAttendees from '../../api/getEventAttendees'
import mockEvent from './__mockData__/eventAttendees'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test getEventAttendees api', () => {
  it('should load event attendees data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    getEventAttendees('1605497505188481').then((data) => {
      expect(data).toBeDefined()
      expect(data[0].name).toEqual('Deku')
    })
  })

  it('returns null when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))

    getEventAttendees('1605497505188481').then((data) => {
      expect(data).toEqual(null)
      expect(fetch).toHaveBeenCalledWith('/event/1605497505188481/attendees', {
        method: 'GET',
      })
    })
  })
})
