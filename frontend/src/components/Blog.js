import React from 'react'
import Togglable from './Togglable'
import blogService from '../services/blogs'



const Blog = ({ blog, blogs, setBlogs, setNotification, user }) =>{
  const like = async (blog) => {
    try {
      const respBlog = await blogService.like(blog.id)
      console.log(respBlog)
      setBlogs(blogs.filter(blogI => blogI.id !== respBlog.id).concat(respBlog))
      setNotification(`Blog ${blog.title} liked`, "success")
    }catch(exception){
      console.error(exception)
      setNotification(`Blog ${blog.title} couldn't be liked`, "error")
    }
  }

  const unlike = async (blog) => {
    try {
      const respBlog = await blogService.unlike(blog.id)
      console.log(respBlog)
      setBlogs(blogs.filter(blogI => blogI.id !== respBlog.id).concat(respBlog))
      setNotification(`Blog ${blog.title} unliked`, "success")
    }catch(exception){
      console.error(exception)
      setNotification(`Blog ${blog.title} couldn't be unliked`, "error")
    }
  }
  
  const deleteBlog = async (blog) => {
    try {
      const respBlog = await blogService.deleteBlog(blog.id)
      console.log(respBlog)
      setBlogs(blogs.filter(blogI => blogI.id !== blog.id))
      setNotification(`Blog ${blog.title} removed`, "success")
    }catch(exception){
      console.error(exception)
      setNotification(`Blog ${blog.title} couldn't be removed`, "error")
    }
  }

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <Togglable viewButtonLabel="view more info">
        <div>{blog.author}</div>
        <div>
          ❤ {blog.likes}
          {user && blog.likers.indexOf(user.id) === -1 && <button onClick={()=>{like(blog)}}>like</button>}
          {user && blog.likers.indexOf(user.id) > -1 && <button onClick={()=>{unlike(blog)}}>unlike</button>}
          {user && blog.creator == user.id && <button onClick={()=>{deleteBlog(blog)}}>Delete</button>}
        </div>
        <div><a href={blog.url}>Visit</a></div>
        <div>{blog.creationDate}</div>  
      </Togglable>
    </div>
  )
}

export default Blog