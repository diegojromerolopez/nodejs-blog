import React, { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Logout from './components/Logout'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const setNotification = (message, notifType) => {
    setNotificationMessage(message)
    setNotificationType(notifType)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON)
      blogService.setToken(userData.token)
      setUser(userData.user)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )  
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userData = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(userData)
      ) 
      blogService.setToken(userData.token)
      setUser(userData.user)
      setUsername('')
      setPassword('')
      setNotification('Right credentials', 'success')
    } catch (exception) {
      setNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser('')
    setNotification('Logout successful', 'error')
  }

  const addBlog = async (event) => {
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
      setNotification("Blog added succesfully", "success")
    }catch(exception){
      setNotification("Blog couldn't be added succesfully", "error")
    }
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage} notifType={notificationType} />
      
      {user ?
        <Logout handleLogout={handleLogout} user={user} /> :
        <Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} /> 
      }      

      {
      user ?
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        ) : ""
      }
      {
        user ?
        <BlogForm onSubmit={addBlog}
                  newBlogTitle={newBlogTitle} setNewBlogTitle={setNewBlogTitle}
                  newBlogAuthor={newBlogAuthor} setNewBlogAuthor={setNewBlogAuthor}
                  newBlogUrl={newBlogUrl} setNewBlogUrl={setNewBlogUrl}
        />
        :
        ""
      }
    </div>
  )
}

export default App
