import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Notification from './Notification'

test('renders notification default message', () => {
  const message = 'This is a test message'

  const component = render(
    <Notification message={message} />
  )

  const div = component.container.querySelector('.notification.success')
  expect(div).toHaveTextContent(message)
})

test('renders notification error message', () => {
    const message = 'This is a test message'
    const notifyType = 'error'
  
    const component = render(
      <Notification message={message} notifType={notifyType} />
    )
  
    const div = component.container.querySelector('.notification.error')
    expect(div).toHaveTextContent(message)
})

test('renders notification success message', () => {
    const message = 'This is a test message'
    const notifyType = 'success'

    const component = render(
        <Notification message={message} notifType={notifyType} />
    )

    const div = component.container.querySelector('.notification.success')
    expect(div).toHaveTextContent(message)
})