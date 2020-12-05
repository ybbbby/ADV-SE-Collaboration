/* eslint-env jest */
import { HashRouter as Router } from 'react-router-dom'
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import EventsPage from '../../pages/EventsPage/EventsPage'
import mockEvents from '../__mockData__/events'

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')

  return {
    ...originalModule,
    useRouteMatch: jest.fn(() => {
      return { params: { category: 'liked' } }
    }),
  }
})

describe('EventsPageMockCategory', () => {
  test('renders events info for each category correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    const { queryByText } = render(
      <Router>
        <EventsPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('afjkjhv')).toBeDefined()
      expect(queryByText('event name')).toBeDefined()
    })
  })

  test('renders no events when api is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    const { queryByText } = render(
      <Router>
        <EventsPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('Oops, there are no such events.')).toBeDefined()
    })
  })
})
