import React from 'react'
import Togglable from './Togglable'
import postService from '../services/posts'


const Post = ({ post, posts, setPosts, setNotification, user }) => {

  const like = async (post) => {
    try {
      const respPost = await postService.like(post.blog, post.id)
      console.log(respPost, posts)
      setPosts(posts.filter(postI => postI.id !== respPost.id).concat(respPost))
      console.log('after', posts)
      setNotification(`Post ${post.title} liked`, 'success')
    }catch(exception){
      console.error(exception)
      setNotification(`Post ${post.title} couldn't be liked`, 'error')
    }
  }

  const unlike = async (post) => {
    try {
      const respPost = await postService.unlike(post.blog, post.id)
      console.log(respPost, posts)
      setPosts(posts.filter(postI => postI.id !== respPost.id).concat(respPost))
      setNotification(`Post ${post.title} unliked`, 'success')
    }catch(exception){
      console.error(exception)
      setNotification(`Post ${post.title} couldn't be unliked`, 'error')
    }
  }

  const deletePost = async (post) => {
    try {
      if(window.confirm(`Are you sure you want to delete ${post.title}`)){
        const respPost = await postService.deletePost(post.blog, post.id)
        console.log(respPost)
        setPosts(posts.filter(postI => postI.id !== post.id))
        setNotification(`Post ${post.title} removed`, 'success')
      }else{
        setNotification(`Post ${post.title} will not be removed (canceled by user)`, 'success')
      }
    }catch(exception){
      console.error(exception)
      setNotification(`Post ${post.title} couldn't be removed`, 'error')
    }
  }

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <Togglable viewButtonLabel="view post content">
        <div>
          {post.content}
        </div>
        <div>
                    ❤ {post.likes}
          {user && post.likers.indexOf(user.id) === -1 && <button onClick={() => {like(post)}}>like</button>}
          {user && post.likers.indexOf(user.id) > -1 && <button onClick={() => {unlike(post)}}>unlike</button>}
          {user && post.creator.id === user.id && <button onClick={() => {deletePost(post)}}>delete</button>}
        </div>
      </Togglable>
    </div>
  )
}

export default Post