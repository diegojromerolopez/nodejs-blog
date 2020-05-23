import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils';

import BlogForm from './BlogForm'

/*jest.mock('../services/blogs');
import blogService from '../services/blogs'

test('<BlogForm /> calls onSubmit', () => {
  const blogs = []
  const setBlogs = jest.fn()
  const setNotification = jest.fn()

  let component
  act(() => {
    component = render(
        <BlogForm blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} />
    )
  })

  const titleInput = component.container.querySelector('#blogFormTitleInput')
  const authorInput = component.container.querySelector('#blogFormAuthorInput')
  const urlInput = component.container.querySelector('#blogFormUrlInput')
  const form = component.container.querySelector('form#blogForm')

  act(() => {
    fireEvent.change(titleInput, {target: { value: 'Test blog title' }})
    fireEvent.change(authorInput, {target: { value: 'Author of test blog' }})
    fireEvent.change(urlInput, {target: { value: 'http://test.com/blog/url/of/my/blog' }})

    fireEvent.submit(form)
  })

  console.log(blogService)
  console.log(blogService.create)

  expect(blogService.create).resolves.toEqual(1)
  //expect(setBlogs.mock.calls).toHaveLength(1)
  //expect(setNotification.mock.calls).toHaveLength(1)
})*/
