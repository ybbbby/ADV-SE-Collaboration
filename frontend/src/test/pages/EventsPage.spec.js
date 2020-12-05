/* eslint-env jest */
import { HashRouter as Router } from 'react-router-dom'
import React from 'react'
import { render, waitFor, fireEvent, within } from '@testing-library/react'
import EventsPage from '../../pages/EventsPage/EventsPage'
import mockEvents from '../__mockData__/events'

describe('EventsPage', () => {
  test('renders events info correctly (nearby)', async () => {
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

  test('changes sort order', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    const { queryByText, queryAllByText, getByRole } = render(
      <Router>
        <EventsPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('event name')).toBeDefined()
    })
    fireEvent.mouseDown(getByRole('button', { name: 'By distance' }))
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByText('By time'))
    expect(queryAllByText('By time')).toBeDefined()
  })

  test('changes back to same key', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    const { queryByText, queryAllByText, getByRole } = render(
      <Router>
        <EventsPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('event name')).toBeDefined()
    })
    fireEvent.mouseDown(getByRole('button', { name: 'By distance' }))
    fireEvent.click(within(getByRole('listbox')).getByText('By time'))
    fireEvent.mouseDown(getByRole('button', { name: 'By time' }))
    fireEvent.click(within(getByRole('listbox')).getByText('By distance'))
    expect(queryAllByText('By distance')).toBeDefined()
  })

  test('changes category', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    const { queryByText, queryAllByText, getByRole } = render(
      <Router>
        <EventsPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('event name')).toBeDefined()
    })
    fireEvent.mouseDown(getByRole('button', { name: 'All' }))
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByText('Music'))
    expect(queryAllByText('Music')).toBeDefined()
  })

  test('changes only show host events', async () => {
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    const { queryByText, getByRole } = render(
      <Router>
        <EventsPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('event name')).toBeDefined()
    })
    getByRole('checkbox').click()
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } })
    expect(getByRole('checkbox').checked).toBe(true)
    localStorage.clear()
  })

  test('changes page', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockEvents))
    const { queryByText, getByLabelText } = render(
      <Router>
        <EventsPage />
      </Router>
    )
    await waitFor(() => {
      expect(queryByText('event name')).toBeDefined()
    })
    fireEvent.click(getByLabelText('page 1', { selector: 'button' }))
    expect(queryByText('1')).toBeDefined()
  })
})
