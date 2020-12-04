/* eslint-env jest */
import { shallow } from 'enzyme'
import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Categories from '../../components/Categories/Categories'

describe('ShareModal', () => {
  test('render logged in', () => {
    render(
      <Router>
        <Categories isLogin={true} />
      </Router>
    )
    expect(screen.queryByText('logout')).toBeDefined()
  })

  test('render not logged in', () => {
    render(
      <Router>
        <Categories isLogin={false} />
      </Router>
    )
    expect(screen.queryByText('logout')).toBeNull()
  })

  test('click logout button (success)', async () => {
    fetch.mockResponseOnce('')
    render(
      <Router>
        <Categories isLogin={true} />
      </Router>
    )
    await waitFor(() => userEvent.click(screen.getByText('Logout')))
    // logout logic tested in api tests
  })

  test('click logout button (fail)', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    render(
      <Router>
        <Categories isLogin={true} />
      </Router>
    )
    await waitFor(() => userEvent.click(screen.getByText('Logout')))
    // logout logic tested in api tests
  })

  test('close login modal when clicks the close button', async () => {
    render(
      <Router>
        <Categories isLogin={false} />
      </Router>
    )
    userEvent.click(screen.getByText('History'))
    userEvent.click(screen.getByRole('button', { name: 'close' }))
    // the handleClose function is tested in the LoginModal tests
  })

  test('renders login modal when clicks the list item', () => {
    render(
      <Router>
        <Categories isLogin={false} />
      </Router>
    )
    userEvent.click(screen.getByText('To go'))
    expect(screen.findAllByRole('presentation')).toBeDefined()
  })

  test('clicks the list item when logged in', () => {
    render(
      <Router>
        <Categories isLogin={true} />
      </Router>
    )
    userEvent.click(screen.getByText('To go'))
    expect(screen.queryByText('Welcome Back!')).toBeNull()
  })

  it('snapshot when logged in', () => {
    const wrapper = shallow(<Categories isLogin={true} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when not logged in', () => {
    const wrapper = shallow(<Categories isLogin={false} />)
    expect(wrapper).toMatchSnapshot()
  })
})
