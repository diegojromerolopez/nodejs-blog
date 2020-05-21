
import React from 'react'
const BlogForm = ({ onSubmit,
    newBlogTitle, setNewBlogTitle,
    newBlogAuthor, setNewBlogAuthor,
    newBlogUrl, setNewBlogUrl }) => (
    <form onSubmit={onSubmit}>
      <div>
        <strong>Title</strong>
        <input value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} />
      </div>
      <div>
        <strong>Author</strong>
        <input value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} />
      </div>
      <div>
        <strong>URL</strong>
        <input value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)}/>
      </div>
      <button type="submit">save</button>
    </form>
)

export default BlogForm
