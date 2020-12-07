/* eslint-env jest */
import { HashRouter as Router } from 'react-router-dom'
import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import EventDetailPage from '../../pages/EventDetailPage/EventDetailPage'
import mockEvent from '../__mockData__/event'
import mockEventAttendees from '../__mockData__/eventAttendees'

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')

  return {
    ...originalModule,
    useRouteMatch: jest.fn(() => {
      return { params: { eventID: '160685996825045' } }
    }),
  }
})
jest.mock('../../global', () => {
  return {
    goEasy: {
      publish: jest.fn(() => {
        return true
      }),
    },
  }
})

describe('EventsPage', () => {
  beforeEach(() => {
    fetch.resetMocks()
    localStorage.clear()
  })
  test('renders event detail info correctly 1', async () => {
    fetch.mockResponses(
      [JSON.stringify(mockEvent), { status: 200 }],
      [JSON.stringify(mockEventAttendees), { status: 200 }]
    )
    const { queryByText } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
  })
  test('renders event detail info correctly 2', async () => {
    mockEvent.liked = true
    mockEvent.description = null
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    mockEvent.liked = false
    mockEvent.description = '22211'
    localStorage.setItem('userEmail', 'test@columbia.edu')
    const { queryByText } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
  })
  test('renders event detail when api is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    const { queryByText } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('Title')).toBeDefined()
    })
  })

  test('renders alert', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fetch.mockReject(() => Promise.reject('API is down'))
    fireEvent.click(getByRole('button', { name: 'REGISTER NOW' }))
    await waitFor(() => {
      expect(queryByText('Fail to update due')).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'Close' }))
    expect(queryByText('Fail to update due')).toBeNull()
  })
  test('render press edit 0', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test@columbia.edu')
    const { queryByText, getByRole, getAllByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fireEvent.click(getAllByRole('button', { name: '' })[0])
    await waitFor(() => {
      expect(getByRole('button', { name: 'close' })).toBeDefined()
    })
  })
  test('render press edit 1', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test@columbia.edu')
    const { queryByText, getByRole, getAllByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fireEvent.click(getAllByRole('button', { name: '' })[1])
    await waitFor(() => {
      expect(getByRole('button', { name: 'close' })).toBeDefined()
    })
  })
  test('render press edit 2', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test@columbia.edu')
    const { queryByText, getByRole, getAllByRole, queryByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fireEvent.click(getAllByRole('button', { name: '' })[2])
    await waitFor(() => {
      expect(getByRole('button', { name: 'close' })).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'close' }))
    await waitFor(() => {
      expect(queryByRole('button', { name: 'close' })).toBeNull()
    })
  })
  test('render delete event success', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'DELETE' }))
    await waitFor(() => {
      expect(queryByText('Successfully deleted your event!')).toBeDefined()
    })
  })

  test('render fail delete event', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fetch.mockReject(() => Promise.reject('API is down'))
    fireEvent.click(getByRole('button', { name: 'DELETE' }))
    await waitFor(() => {
      expect(queryByText('Fail to delete the event!')).toBeDefined()
    })
  })

  test('render fail delete event', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fetch.mockReject(() => Promise.reject('API is down'))
    fireEvent.click(getByRole('button', { name: 'DELETE' }))
    await waitFor(() => {
      expect(queryByText('Fail to delete the event!')).toBeDefined()
    })
  })
  test('render register event', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fetch.resetMocks()
    fetch.mockResponses(
      [{ status: 200 }],
      [JSON.stringify(mockEventAttendees), { status: 200 }]
    )
    fireEvent.click(getByRole('button', { name: 'REGISTER NOW' }))
    await waitFor(() => {
      expect(queryByText('You have reistered this event!')).toBeDefined()
    })
  })
  test('render register event 2', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fetch.resetMocks()
    fetch.mockResponseOnce({ status: 200 })
    fireEvent.click(getByRole('button', { name: 'REGISTER NOW' }))
    await waitFor(() => {
      expect(queryByText('You have reistered this event!')).toBeDefined()
    })
  })
  test('render cancel register event', async () => {
    mockEvent.attended = true
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    mockEvent.attended = false
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(mockEvent), { status: 200 }],
      [JSON.stringify(mockEventAttendees), { status: 200 }]
    )
    fireEvent.click(getByRole('button', { name: 'CANCEL' }))
    await waitFor(() => {
      expect(
        queryByText('Successfully cancelled your registration.')
      ).toBeDefined()
    })
  })
  test('render like event', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'add to favorites' }))
    await waitFor(() => {
      expect(queryByText('Saved to your favourite events!')).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'add to favorites' }))
    await waitFor(() => {
      expect(
        queryByText('Remove this event from your favourite events!')
      ).toBeDefined()
    })
    fetch.mockReject(() => Promise.reject('API is down'))
    fireEvent.click(getByRole('button', { name: 'add to favorites' }))
    await waitFor(() => {
      expect(queryByText('Saved to your favourite events!')).toBeNull()
    })
  })
  test('render share event', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvent))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByRole, queryByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'share' }))
    await waitFor(() => {
      expect(queryByText('Share by Email')).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'Cancel' }))
    await waitFor(() => {
      expect(queryByRole('button', { name: 'Cancel' })).toBeNull()
    })
  })
  test('render participants event', async () => {
    fetch.mockResponses(
      [JSON.stringify(mockEvent), { status: 200 }],
      [JSON.stringify(mockEventAttendees), { status: 200 }]
    )
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByRole } = render(
      <Router>
        <EventDetailPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('test user')).toBeDefined()
      expect(queryByText('music')).toBeDefined()
    })
    fireEvent.click(getByRole('button', { name: 'check participants' }))
    await waitFor(() => {
      expect(queryByText('Deku')).toBeDefined()
    })
  })
})
