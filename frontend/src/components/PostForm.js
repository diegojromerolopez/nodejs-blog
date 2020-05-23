
import React, { useState } from 'react'
import postService from '../services/posts'

const PostForm = ({ blog, posts, setPosts, setNotification }) => {
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostUrl, setNewPostUrl] = useState('')

  const addPost = async (event) => {
    event.preventDefault()
    const postObject = {
      title: newPostTitle,
      content: newPostContent,
      url: newPostUrl
    }
    try {
      const respPost = await postService.create(blog.id, postObject)
      console.log(respPost, posts)
      setPosts([respPost].concat(posts))
      setNewPostTitle('')
      setNewPostContent('')
      setNewPostUrl('')
      setNotification(`Post added succesfully to ${blog.title}`, 'success')
    }catch(exception){
      console.error(exception)
      setNotification(`Post couldn't added succesfully to ${blog.title}`, 'error')
    }
  }

  return (
    <form onSubmit={addPost}>
      <div>
        <strong>Title</strong>
        <input value={newPostTitle} onChange={({ target }) => setNewPostTitle(target.value)} />
      </div>
      <div>
        <strong>Content</strong>
        <textarea value={newPostContent} onChange={({ target }) => setNewPostContent(target.value)} />
      </div>
      <div>
        <strong>URL</strong>
        <input value={newPostUrl} onChange={({ target }) => setNewPostUrl(target.value)}/>
      </div>
      <button type="submit">save</button>
    </form>
  )
}

export default PostForm
