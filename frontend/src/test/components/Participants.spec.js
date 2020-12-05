/* eslint-env jest */
import { shallow } from 'enzyme'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Participants from '../../components/Participants/Participants'

const participants = [{ email: 'test@columbia.edu', username: 'test' }]

describe('Participants', () => {
  test('render participants corretly', () => {
    let open = true
    const setOpen = jest.fn(() => (open = false))
    render(
      <Participants open={open} setOpen={setOpen} participants={participants} />
    )
    expect(screen.queryByText('test(test@columbia.edu)')).toBeDefined()
  })

  test('close participants modal', async () => {
    let open = true
    const setOpen = jest.fn(() => (open = false))
    render(
      <Participants open={open} setOpen={setOpen} participants={participants} />
    )
    fireEvent.keyDown(screen.getByRole('presentation'), {
      key: 'Escape',
      code: 'Escape',
    })
    expect(setOpen).toHaveBeenCalledTimes(1)
  })

  it('snapshot when opened', () => {
    let open = true
    const setOpen = jest.fn(() => (open = false))
    const wrapper = shallow(
      <Participants open={open} setOpen={setOpen} participants={participants} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot when closed', () => {
    let open = false
    const setOpen = jest.fn(() => (open = false))
    const wrapper = shallow(
      <Participants open={open} setOpen={setOpen} participants={participants} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
