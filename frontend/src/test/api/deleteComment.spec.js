/* eslint-env jest */
import deleteComment from '../../api/deleteComment'
import mockDelete from '../__mockData__/deleteComment'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test deleteComment api', () => {
  it('returns true when operating successfully', () => {
    fetch.mockResponseOnce(JSON.stringify(mockDelete))
    deleteComment(12352).then((data) => {
      expect(data).toEqual(true)
    })
  })

  it('returns false when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    deleteComment(23145).then((data) => {
      expect(data).toEqual(false)
      expect(fetch).toHaveBeenCalledWith('/comment/23145', {
        method: 'DELETE',
      })
    })
  })
})
