/* eslint-env jest */
import { shallow } from 'enzyme'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShareModal from '../../components/ShareModal/ShareModal'

const url = 'www.google.com'

describe('ShareModal', () => {
  test('does not render modal when closed', () => {
    let openShare = false
    const close = jest.fn(() => (openShare = false))
    render(
      <ShareModal handleClose={() => close()} open={openShare} url={url} />
    )
    expect(screen.queryByText('Welcome Back!')).toBeNull()
  })

  test('renders modal when opened', () => {
    let openShare = true
    const close = jest.fn(() => (openShare = false))
    render(
      <ShareModal handleClose={() => close()} open={openShare} url={url} />
    )
    expect(screen.queryByText(url)).toBeDefined()
  })

  test('click copy button', async () => {
    const jsdomPrompt = window.prompt
    window.prompt = () => {}
    let openShare = true
    const close = jest.fn(() => (openShare = false))
    render(
      <ShareModal handleClose={() => close()} open={openShare} url={url} />
    )
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'copy' }))
    )
    expect(screen.queryByText('Copied')).toBeDefined()
    window.prompt = jsdomPrompt
  })

  test('close modal', async () => {
    let openShare = true
    const close = jest.fn(() => (openShare = false))
    render(
      <ShareModal handleClose={() => close()} open={openShare} url={url} />
    )
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    )
    expect(close).toHaveBeenCalledTimes(1)
  })

  test('close modal by clicking away', () => {
    let openShare = true
    const close = jest.fn(() => (openShare = false))
    render(
      <ShareModal handleClose={() => close()} open={openShare} url={url} />
    )
    fireEvent.keyDown(screen.getByRole('presentation'), {
      key: 'Escape',
      code: 'Escape',
    })
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('snapshot when open', () => {
    let openShare = true
    const close = jest.fn(() => (openShare = false))
    const wrapper = shallow(
      <ShareModal handleClose={() => close()} open={openShare} url={url} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when closed', () => {
    let openShare = false
    const close = jest.fn(() => (openShare = false))
    const wrapper = shallow(
      <ShareModal handleClose={() => close()} open={openShare} url={url} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
