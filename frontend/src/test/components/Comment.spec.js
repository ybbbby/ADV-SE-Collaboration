/* eslint-env jest */
import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import Comment from '../../components/Comment/Comment'

jest.mock('../../global', () => {
  return {
    goEasy: {
      publish: jest.fn(() => {
        return true
      }),
    },
  }
})
describe('Comment', () => {
  beforeEach(() => {
    fetch.resetMocks()
    localStorage.clear()
  })
  test('render comment unsuccessfully', async () => {
    let failInfo = ''
    let serverity = ''
    let alertOpen = false
    let loginOpen = false
    let comments = []
    const setfailInfo = jest.fn((f) => (failInfo = f))
    const setServerity = jest.fn((s) => (serverity = s))
    const setAlertOpen = jest.fn((a) => (alertOpen = a))
    const setLoginOpen = jest.fn((l) => (loginOpen = l))
    const setComments = jest.fn((c) => (comments = c))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByPlaceholderText, getByRole } = render(
      <Comment
        setfailInfo={setfailInfo}
        setServerity={setServerity}
        setAlertOpen={setAlertOpen}
        setLoginOpen={setLoginOpen}
        eventId={'123'}
        comments={comments}
        setComments={setComments}
        eventHost={'deku'}
      />
    )
    fireEvent.change(getByPlaceholderText('Be the first one to comment!'), {
      target: { value: 'Deku The hero' },
    })
    expect(queryByText('Deku The hero')).toBeDefined()
    fireEvent.keyDown(getByRole('textbox', { name: '' }), {
      key: 'Enter',
      keyCode: 13,
      charCode: 13,
    })
    expect(queryByText('Deku The hero')).toBeDefined()
    await waitFor(() => {
      expect(failInfo).toEqual(
        'Fail to add comments due to connection error with server'
      )
      expect(serverity).toEqual('error')
      expect(alertOpen).toEqual(true)
    })
    expect(loginOpen).toEqual(false)
  })
  test('render comment successfully', async () => {
    fetch.mockResponseOnce('12345')
    let failInfo = ''
    let serverity = ''
    let alertOpen = false
    let loginOpen = false
    let comments = []
    const setfailInfo = jest.fn((f) => (failInfo = f))
    const setServerity = jest.fn((s) => (serverity = s))
    const setAlertOpen = jest.fn((a) => (alertOpen = a))
    const setLoginOpen = jest.fn((l) => (loginOpen = l))
    const setComments = jest.fn((c) => (comments = c))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByPlaceholderText, getByRole } = render(
      <Comment
        setfailInfo={setfailInfo}
        setServerity={setServerity}
        setAlertOpen={setAlertOpen}
        setLoginOpen={setLoginOpen}
        eventId={'123'}
        comments={comments}
        setComments={setComments}
        eventHost={'deku'}
      />
    )
    fireEvent.change(getByPlaceholderText('Be the first one to comment!'), {
      target: { value: 'Deku The hero' },
    })
    expect(queryByText('Deku The hero')).toBeDefined()
    fireEvent.keyDown(getByRole('textbox', { name: '' }), {
      key: 'Enter',
      keyCode: 13,
      charCode: 13,
    })
    expect(queryByText('Deku The hero')).toBeDefined()
    await waitFor(() => {
      expect(comments.length).toEqual(1)
      expect(failInfo).toEqual('')
      expect(serverity).toEqual('')
      expect(alertOpen).toEqual(false)
      expect(loginOpen).toEqual(false)
    })
  })
  test('render comment press other key', async () => {
    fetch.mockResponseOnce('12345')
    let failInfo = ''
    let serverity = ''
    let alertOpen = false
    let loginOpen = false
    let comments = []
    const setfailInfo = jest.fn((f) => (failInfo = f))
    const setServerity = jest.fn((s) => (serverity = s))
    const setAlertOpen = jest.fn((a) => (alertOpen = a))
    const setLoginOpen = jest.fn((l) => (loginOpen = l))
    const setComments = jest.fn((c) => (comments = c))
    localStorage.setItem('userEmail', 'test1@columbia.edu')
    const { queryByText, getByPlaceholderText, getByRole } = render(
      <Comment
        setfailInfo={setfailInfo}
        setServerity={setServerity}
        setAlertOpen={setAlertOpen}
        setLoginOpen={setLoginOpen}
        eventId={'123'}
        comments={comments}
        setComments={setComments}
        eventHost={'deku'}
      />
    )
    fireEvent.change(getByPlaceholderText('Be the first one to comment!'), {
      target: { value: 'Deku The hero' },
    })
    expect(queryByText('Deku The hero')).toBeDefined()
    fireEvent.keyDown(getByRole('textbox', { name: '' }), {
      key: 'Escape',
    })
    expect(queryByText('Deku The hero')).toBeDefined()
    await waitFor(() => {
      expect(comments.length).toEqual(0)
      expect(failInfo).toEqual('')
      expect(serverity).toEqual('')
      expect(alertOpen).toEqual(false)
      expect(loginOpen).toEqual(false)
    })
  })
  test('render comment without login', async () => {
    let failInfo = ''
    let serverity = ''
    let alertOpen = false
    let loginOpen = false
    let comments = []
    const setfailInfo = jest.fn((f) => (failInfo = f))
    const setServerity = jest.fn((s) => (serverity = s))
    const setAlertOpen = jest.fn((a) => (alertOpen = a))
    const setLoginOpen = jest.fn((l) => (loginOpen = l))
    const setComments = jest.fn((c) => (comments = c))
    const { queryByPlaceholderText } = render(
      <Comment
        setfailInfo={setfailInfo}
        setServerity={setServerity}
        setAlertOpen={setAlertOpen}
        setLoginOpen={setLoginOpen}
        eventId={'123'}
        comments={comments}
        setComments={setComments}
        eventHost={'deku'}
      />
    )
    await waitFor(() => {
      expect(queryByPlaceholderText('Be the first one to comment!')).toBeNull()
      expect(comments.length).toEqual(0)
      expect(failInfo).toEqual('')
      expect(serverity).toEqual('')
      expect(alertOpen).toEqual(false)
      expect(loginOpen).toEqual(false)
    })
  })
  test('render delete comment', async () => {
    fetch.mockResponseOnce({ status: '200' })
    let failInfo = ''
    let serverity = ''
    let alertOpen = false
    let loginOpen = false
    let comments = [
      {
        user: 'deku@example.com',
        content: 'hello',
        time: '2020-12-07T07:04:51.853Z',
        id: '1243',
      },
      {
        user: 'deku1@example.com',
        content: 'hello',
        time: '2020-12-07T07:04:51.853Z',
        id: '123',
      },
    ]
    const setfailInfo = jest.fn((f) => (failInfo = f))
    const setServerity = jest.fn((s) => (serverity = s))
    const setAlertOpen = jest.fn((a) => (alertOpen = a))
    const setLoginOpen = jest.fn((l) => (loginOpen = l))
    const setComments = jest.fn((c) => (comments = c))
    localStorage.setItem('userEmail', 'deku@example.com')
    const { getByRole } = render(
      <Comment
        setfailInfo={setfailInfo}
        setServerity={setServerity}
        setAlertOpen={setAlertOpen}
        setLoginOpen={setLoginOpen}
        eventId={'123'}
        comments={comments}
        setComments={setComments}
        eventHost={'deku'}
      />
    )
    fireEvent.click(getByRole('button', { name: 'Delete' }))
    await waitFor(() => {
      expect(comments.length).toEqual(1)
      expect(failInfo).toEqual('Comment deleted!')
      expect(serverity).toEqual('success')
      expect(alertOpen).toEqual(true)
      expect(loginOpen).toEqual(false)
    })
  })
  test('render delete comment unsuccessfully', async () => {
    fetch.mockReject(() => Promise.reject('API is down'))
    let failInfo = ''
    let serverity = ''
    let alertOpen = false
    let loginOpen = false
    let comments = [
      {
        user: 'deku@example.com',
        content: 'hello',
        time: '2020-12-07T07:04:51.853Z',
      },
    ]
    const setfailInfo = jest.fn((f) => (failInfo = f))
    const setServerity = jest.fn((s) => (serverity = s))
    const setAlertOpen = jest.fn((a) => (alertOpen = a))
    const setLoginOpen = jest.fn((l) => (loginOpen = l))
    const setComments = jest.fn((c) => (comments = c))
    localStorage.setItem('userEmail', 'deku@example.com')
    const { getByRole } = render(
      <Comment
        setfailInfo={setfailInfo}
        setServerity={setServerity}
        setAlertOpen={setAlertOpen}
        setLoginOpen={setLoginOpen}
        eventId={'123'}
        comments={comments}
        setComments={setComments}
        eventHost={'deku'}
      />
    )
    fireEvent.click(getByRole('button', { name: 'Delete' }))
    await waitFor(() => {
      expect(comments.length).toEqual(1)
      expect(failInfo).toEqual('Fail to delete the comment')
      expect(serverity).toEqual('error')
      expect(alertOpen).toEqual(true)
      expect(loginOpen).toEqual(false)
    })
  })
})
