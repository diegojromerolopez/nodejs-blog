import React, { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Logout from './components/Logout'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import tokenService from './services/token'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)
  // Login states
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
      tokenService.setToken(userData.token)
      setUser(userData.user)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [])

  const blogSorter = (b1, b2) => {
    if(b1.likes < b2.likes){
      return 1
    }
    if(b1.likes > b2.likes){
      return -1
    }
    if(b1.title < b2.title){
      return 1
    }
    if(b1.title > b2.title){
      return -1
    }
    return 0
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userData = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(userData)
      )
      tokenService.setToken(userData.token)
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

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage} notifType={notificationType} />

      <Togglable viewButtonLabel="new blog">
        {
          user ?
            <BlogForm blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} />
            :
            ''
        }
      </Togglable>

      {user ?
        <Logout handleLogout={handleLogout} user={user} /> :
        <Login handleLogin={handleLogin}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
        />
      }

      {
        user ?
          blogs.sort(blogSorter).map(blog =>
            <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} user={user} />
          ) : ''
      }
    </div>
  )
}

export default App
