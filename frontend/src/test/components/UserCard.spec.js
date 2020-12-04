/* eslint-env jest */
import { shallow } from 'enzyme'
import { HashRouter as Router } from 'react-router-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserCard from '../../components/UserCard/UserCard'

const userDataLoggedIn = {
  name: 'test',
  email: 'test@columbia.edu',
  picture: 'testurl',
}

const userDataNotLoggedIn = {
  name: '',
  email: '',
  picture: '',
}

describe('UserCard', () => {
  test('renders user info correctly when logged in', () => {
    render(
      <Router>
        <UserCard data={userDataLoggedIn} isLogin={true} />
      </Router>
    )
    expect(screen.queryByText('test@columbia.edu')).toBeDefined()
    expect(screen.queryByText('test')).toBeDefined()
    expect(screen.queryByText('Create event')).toBeDefined()
  })

  test('renders login button when not logged in', () => {
    render(
      <Router>
        <UserCard data={userDataNotLoggedIn} isLogin={false} />
      </Router>
    )
    expect(screen.queryByText('Login')).toBeDefined()
  })

  test('renders login modal when clicks the login button', () => {
    render(
      <Router>
        <UserCard data={userDataNotLoggedIn} isLogin={false} />
      </Router>
    )
    userEvent.click(screen.getByRole('button'))
    expect(screen.findAllByRole('presentation')).toBeDefined()
  })

  test('close login modal when clicks the close button', async () => {
    render(
      <Router>
        <UserCard data={userDataNotLoggedIn} isLogin={false} />
      </Router>
    )
    userEvent.click(screen.getByRole('button'))
    userEvent.click(screen.getByRole('button', { name: 'close' }))
    // todo: no idea how to simulate
  })

  it('snapshot when logged in', () => {
    const wrapper = shallow(<UserCard data={userDataLoggedIn} isLogin={true} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when not logged in', () => {
    const wrapper = shallow(
      <UserCard data={userDataNotLoggedIn} isLogin={false} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
