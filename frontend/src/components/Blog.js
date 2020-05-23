import React, { useState } from 'react'
import Togglable from './Togglable'
import PostForm from './PostForm'
import Post from './Post'
import blogService from '../services/blogs'
import postService from '../services/posts'


const Blog = ({ blog, blogs, setBlogs, setNotification, user }) => {
  const [posts, setPosts] = useState([])
  const like = async (blog) => {
    try {
      const respBlog = await blogService.like(blog.id)
      setBlogs(blogs.filter(blogI => blogI.id !== respBlog.id).concat(respBlog))
      setNotification(`Blog ${blog.title} liked`, 'success')
    }catch(exception){
      console.error(exception)
      setNotification(`Blog ${blog.title} couldn't be liked`, 'error')
    }
  }

  const unlike = async (blog) => {
    try {
      const respBlog = await blogService.unlike(blog.id)
      console.log(respBlog)
      setBlogs(blogs.filter(blogI => blogI.id !== respBlog.id).concat(respBlog))
      setNotification(`Blog ${blog.title} unliked`, 'success')
    }catch(exception){
      console.error(exception)
      setNotification(`Blog ${blog.title} couldn't be unliked`, 'error')
    }
  }

  const deleteBlog = async (blog) => {
    try {
      if(window.confirm(`Are you sure you want to delete ${blog.title}`)){
        const respBlog = await blogService.deleteBlog(blog.id)
        console.log(respBlog)
        setBlogs(blogs.filter(blogI => blogI.id !== blog.id))
        setNotification(`Blog ${blog.title} removed`, 'success')
      }else{
        setNotification(`Blog ${blog.title} will not be removed (canceld by user)`, 'success')
      }
    }catch(exception){
      console.error(exception)
      setNotification(`Blog ${blog.title} couldn't be removed`, 'error')
    }
  }

  const viewPosts = async (blog) => {
    try {
      const respPosts = await postService.getAll(blog.id)
      console.log(respPosts)
      setPosts(respPosts)
      setNotification(`Posts of blog ${blog.title} loaded`, 'success')
    }catch(exception){
      console.error(exception)
      setNotification(`Posts of blog ${blog.title} couldn't be loaded`, 'error')
    }
  }

  const hidePosts = async () => {
    setPosts([])
  }
  //console.log(user, blog)
  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <Togglable viewButtonLabel="view more info" hideButtonLabel="hide info" onVisible={() => setPosts([])}>
        <div>{blog.author}</div>
        <div>
          ❤ {blog.likes}
          {user && blog.likers.indexOf(user.id) === -1 && <button onClick={() => {like(blog)}}>like</button>}
          {user && blog.likers.indexOf(user.id) > -1 && <button onClick={() => {unlike(blog)}}>unlike</button>}
          {user && blog.creator === user.id && <button onClick={() => {deleteBlog(blog)}}>Delete</button>}
        </div>
        <div><a href={blog.url}>Visit</a></div>
        <div>{blog.creationDate}</div>
        {
          blog.creator && user.id === blog.creator.id &&
        <Togglable viewButtonLabel="new post">
          <PostForm blog={blog} posts={posts} setPosts={setPosts} setNotification={setNotification} />
        </Togglable>
        }
        <div>
          {posts.length === 0 && <button onClick={() => viewPosts(blog)}>View posts</button>}
          {posts.length > 0 && <button onClick={() => hidePosts()}>Hide posts</button>}
        </div>
        {
          posts ?
            posts.map(post =>
              <Post key={post.id} post={post} posts={posts} setPosts={setPosts} setNotification={setNotification} user={user} />
            ) : ''
        }
      </Togglable>
    </div>
  )
}

export default Blog