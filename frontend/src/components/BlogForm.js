
import React, { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ blogs, setBlogs, setNotification }) => {

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = async (event) => {
    console.error('addBlog')
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }
    try {
      const respBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(respBlog))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setNotification('Blog added succesfully', 'success')
    }catch(exception){
      console.error(exception)
      setNotification('Blog couldn\'t be added succesfully', 'error')
    }
    console.error('addBlog END')
  }


  return (
    <form id={'blogForm'} onSubmit={addBlog}>
      <div>
        <strong>Title</strong>
        <input id={'blogFormTitleInput'} value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} />
      </div>
      <div>
        <strong>Author</strong>
        <input id={'blogFormAuthorInput'} value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} />
      </div>
      <div>
        <strong>URL</strong>
        <input id={'blogFormUrlInput'} value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)}/>
      </div>
      <button id={'blogFormSubmit'} type="submit">save</button>
    </form>
  )
}

export default BlogForm
