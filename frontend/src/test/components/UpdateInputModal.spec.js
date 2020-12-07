/* eslint-env jest */
import { shallow } from 'enzyme'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import UpdateInputModal from '../../components/UpdateInputModal/UpdateInputModal'
import userEvent from '@testing-library/user-event'

describe('UpdateInputModal', () => {
  test('does not render modal when closed', () => {
    let openModal = false
    const close = jest.fn(() => (openModal = false))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={3}
        description={'Hello'}
      />
    )
    expect(screen.queryByText('Hello')).toBeNull()
  })

  test('renders modal when opened with description', () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={3}
        description={'Hello'}
      />
    )
    expect(screen.queryByText('Hello')).toBeDefined()
  })

  test('renders modal when opened with date', () => {
    let openModal = true
    const date = new Date(Date.UTC(22, 1, 2, 3, 4, 5))
    const close = jest.fn(() => (openModal = false))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={2}
        description={'Hello'}
        date={date}
      />
    )
    expect(screen.queryByText(date.getMonth())).toBeDefined()
  })
  test('renders modal when opened with location', () => {
    let openModal = true
    const date = new Date(Date.UTC(22, 1, 2, 3, 4, 5))
    const close = jest.fn(() => (openModal = false))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={4}
        description={'Hello'}
        date={date}
      />
    )
    expect(screen.queryByText('Search Places ...')).toBeDefined()
  })
  test('close modal', async () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={3}
        description={'Hello'}
      />
    )
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'close' }))
    )
    expect(close).toHaveBeenCalledTimes(1)
  })
  test('close modal by foced close', () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={3}
        description={'Hello'}
      />
    )
    fireEvent.keyDown(screen.getByRole('presentation'), {
      key: 'Escape',
      code: 'Escape',
    })
    expect(close).toHaveBeenCalledTimes(1)
  })
  test('change modal with new description', async () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={3}
        description={'Hello'}
      />
    )
    fireEvent.change(screen.getByText('Hello'), {
      target: { value: 'Deku The hero' },
    })
    expect(screen.queryByText('Deku The hero')).toBeDefined()
  })
  test('confirm modal with new date', async () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    const date = new Date(Date.UTC(22, 1, 2, 3, 4, 5))
    render(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={2}
        description={'Hello'}
        date={date}
      />
    )
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    )
    expect(close).toHaveBeenCalledTimes(1)
  })
  it('snapshot when description change', () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    const wrapper = shallow(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={3}
        description={'Hello'}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when date change', () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    const date = new Date(Date.UTC(22, 1, 2, 3, 4, 5))

    const wrapper = shallow(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={2}
        description={'Hello'}
        date={date}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when location change', () => {
    let openModal = true
    const close = jest.fn(() => (openModal = false))
    const date = new Date(Date.UTC(22, 1, 2, 3, 4, 5))

    const wrapper = shallow(
      <UpdateInputModal
        handleClose={() => close()}
        open={openModal}
        type={4}
        description={'Hello'}
        date={date}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
