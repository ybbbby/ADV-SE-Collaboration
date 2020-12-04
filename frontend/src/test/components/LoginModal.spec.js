/* eslint-env jest */
import { shallow } from 'enzyme'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginModal from '../../components/LoginModal/LoginModal'

describe('LoginModal', () => {
  test('does not render modal when closed', () => {
    let openLogin = false
    const setOpenLogin = jest.fn(() => (openLogin = false))
    render(<LoginModal handleClose={() => setOpenLogin()} open={openLogin} />)
    expect(screen.queryByText('Welcome Back!')).toBeNull()
  })

  test('renders modal when opened', () => {
    let openLogin = true
    const setOpenLogin = jest.fn(() => (openLogin = false))
    render(<LoginModal handleClose={() => setOpenLogin()} open={openLogin} />)
    expect(screen.queryByText('Welcome Back!')).toBeDefined()
  })

  test('click sign in button', async () => {
    fetch.mockResponseOnce('/')
    let openLogin = true
    const setOpenLogin = jest.fn(() => (openLogin = false))
    render(<LoginModal handleClose={() => setOpenLogin()} open={openLogin} />)
    await waitFor(() =>
      userEvent.click(
        screen.getByRole('button', { name: 'Sign in with Google' })
      )
    )
    expect(screen.queryByText('Welcome Back!')).toBeDefined()
  })

  test('close modal', async () => {
    let openLogin = true
    const setOpenLogin = jest.fn(() => (openLogin = false))
    render(<LoginModal handleClose={() => setOpenLogin()} open={openLogin} />)
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'close' }))
    )
    expect(setOpenLogin).toHaveBeenCalledTimes(1)
  })

  test('close modal by clicking away', () => {
    let openLogin = true
    const setOpenLogin = jest.fn(() => (openLogin = false))
    render(<LoginModal handleClose={() => setOpenLogin()} open={openLogin} />)
    fireEvent.keyDown(screen.getByRole('presentation'), {
      key: 'Escape',
      code: 'Escape',
    })
    expect(setOpenLogin).toHaveBeenCalledTimes(1)
  })

  it('snapshot when open', () => {
    let openLogin = true
    const setOpenLogin = jest.fn(() => (openLogin = false))
    const wrapper = shallow(
      <LoginModal handleClose={() => setOpenLogin()} open={openLogin} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when closed', () => {
    let openLogin = false
    const setOpenLogin = jest.fn(() => (openLogin = false))
    const wrapper = shallow(
      <LoginModal handleClose={() => setOpenLogin()} open={openLogin} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
