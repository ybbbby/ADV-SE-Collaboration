/* eslint-env jest */
import postJoin from '../../api/postJoin'
import mockJoin from './__mockData__/join'

beforeEach(() => {
  fetch.resetMocks()
})

describe('test postLike api', () => {
  it('returns true when operating successfully', () => {
    fetch.mockResponseOnce(JSON.stringify(mockJoin))
    postJoin(12352, true).then((data) => {
      expect(data).toEqual(true)
    })
  })

  it('returns false when exception', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    const requestForm = new FormData()
    requestForm.append('join', false)
    postJoin(23145, false).then((data) => {
      expect(data).toEqual(false)
      expect(fetch).toHaveBeenCalledWith('/user/event/23145/join', {
        method: 'POST',
        body: requestForm,
      })
    })
  })
})
