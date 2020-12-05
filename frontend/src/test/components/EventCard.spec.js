/* eslint-env jest */
import { shallow } from 'enzyme'
import { HashRouter as Router } from 'react-router-dom'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import EventCard from '../../components/EventCard/EventCard'

const eventConfig = {
  address: '1275 York Avenue, New York, NY, USA',
  attended: false,
  author: 'test user',
  category: 'music',
  comments: [],
  description: '22211',
  event_id: '160685996825045',
  image: 'https://yesok.s3.amazonaws.com/uploads%2FIMG_2396.JPG',
  latitude: '40.764215',
  liked: false,
  longitude: '-73.956104',
  name: 'event name',
  num_likes: 0,
  time: '2020-12-25 17:49:00',
  user_email: 'test@columbia.edu',
  zipcode: '10025',
}

const openLogin = jest.fn()

describe('EventCard', () => {
  test('renders event info correctly when logged in', () => {
    render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    expect(
      screen.queryByText('1275 York Avenue, New York, NY, USA')
    ).toBeDefined()
    expect(screen.queryByText('event name')).toBeDefined()
    expect(screen.queryByText('music')).toBeDefined()
    expect(screen.queryByText('test user')).toBeDefined()
  })

  test('judge if category exists', () => {
    eventConfig.category = ''
    render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    expect(screen.queryByText('music')).toBeNull()
  })

  test('host badge invisible when the user is not host', () => {
    render(
      <Router>
        <EventCard
          user={'other user'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    expect(screen.getByText('host').closest('span')).toHaveClass(
      'MuiBadge-invisible'
    )
  })

  test('clicks like button when logged in', async () => {
    fetch.mockResponseOnce({ status: 200 })
    const { getByText } = render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    await waitFor(() => {
      expect(getByText('Saved to your favourite events!')).toBeInTheDocument()
    })
  })

  test('clicks like button when logged in (fail)', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    const { queryByText } = render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    await waitFor(() => {
      expect(queryByText('Saved to your favourite events!')).toBeNull()
    })
  })

  test('cancel like when logged in', async () => {
    fetch.mockResponseOnce({ status: 200 })
    eventConfig.liked = true
    const { getByText } = render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    await waitFor(() => {
      expect(
        getByText('Remove this event from your favourite events!')
      ).toBeInTheDocument()
    })
  })

  test('clicks like button when not logged in', () => {
    render(
      <Router>
        <EventCard user={null} config={eventConfig} openLogin={openLogin} />
      </Router>
    )
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    expect(screen.findAllByRole('presentation')).toBeDefined()
  })

  test('clicks learn more when logged in', () => {
    render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Learn More' }))
    expect(screen.queryByText('Welcome Back!')).toBeNull()
  })

  test('clicks learn more when not logged in', () => {
    render(
      <Router>
        <EventCard user={null} config={eventConfig} openLogin={openLogin} />
      </Router>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Learn More' }))
    expect(screen.findAllByRole('presentation')).toBeDefined()
  })

  test('clicks share button when logged in', async () => {
    render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(screen.getByLabelText('share', { selector: 'button' }))
    expect(screen.getByText('Share the event')).toBeInTheDocument()
  })

  test('close alert after clicking the like button', async () => {
    fetch.mockResponseOnce({ status: 200 })
    const { getByRole, queryByText } = render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    await waitFor(() => {
      expect(getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => {
      expect(queryByText('Saved to your favourite events!')).toBeNull()
    })
  })

  test('close alert after canceling like', async () => {
    fetch.mockResponseOnce({ status: 200 })
    eventConfig.liked = true
    const { getByRole, queryByText } = render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    await waitFor(() => {
      expect(getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => {
      expect(
        queryByText('Remove this event from your favourite events!')
      ).toBeNull()
    })
  })

  test('close alert after clicking away', async () => {
    fetch.mockResponseOnce({ status: 200 })
    const { getByRole, queryByText } = render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    await waitFor(() => {
      expect(getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
    fireEvent.click(
      screen.getByLabelText('add to favorites', { selector: 'button' })
    )
    await waitFor(() => {
      expect(queryByText('Saved to your favourite events!')).toBeNull()
    })
  })

  test('close share modal when clicks the close button', async () => {
    render(
      <Router>
        <EventCard
          user={'test@columbia.edu'}
          config={eventConfig}
          openLogin={openLogin}
        />
      </Router>
    )
    fireEvent.click(screen.getByLabelText('share', { selector: 'button' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    // the handleClose function is tested in the ShareModal tests
  })

  it('snapshot when logged in', () => {
    const wrapper = shallow(
      <EventCard
        user={'test@columbia.edu'}
        config={eventConfig}
        openLogin={openLogin}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when not logged in', () => {
    const wrapper = shallow(
      <EventCard user={null} config={eventConfig} openLogin={openLogin} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
