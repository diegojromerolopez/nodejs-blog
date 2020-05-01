const postsRouter = require('express').Router({ mergeParams: true })
const Blog = require('../models/blog')
const Post = require('../models/post')


postsRouter.get('/', async (request, response) => {
    const blog = await Blog.findById(request.params.blogId).populate('posts')
    response.json(blog.posts.map(post => post.toJSON()))
})

postsRouter.post('/', async (request, response) => {
    // Find the blog parent
    const blog = await Blog.findById(request.params.blogId)
    // Post creation
    const post = new Post({blog: blog._id, ...request.body})
    post.creationDate = new Date()
    await post.save()    
    // Update blog part
    blog.posts.push(post)
    await blog.save()
    // HTTP response
    response.status(204).end()
})

postsRouter.put('/:postId', async (request, response) => {
    const updatedAttributes = {}
    for(let attribute of ['title', 'content', 'url', 'likes']){
        if(request.body[attribute]){
            updatedAttributes[attribute] = request.body[attribute]
        }
    }
    if(Object.keys(updatedAttributes).length === 0){
        return response.status(400).end()
    }    
    const updatedPost = await Post.findOneAndUpdate(
        {blog: request.params.blogId, _id: request.params.postId},
        updatedAttributes,
        {new: true}
    )
    if(updatedPost){
        response.json(updatedPost.toJSON())
    }else{
        response.status(404).end()
    }
})

postsRouter.delete('/:postId', async (request, response) => {
    console.log(request.params)
    const deletedPost = await Post.findOneAndDelete(
        {blog: request.params.blogId, _id: request.params.postId}
    )
    console.log(deletedPost)
    if(deletedPost){
        console.log(deletedPost)
        const blog = await Blog.findById(request.params.blogId)
        blog.posts.pull(request.params.postId)
        await blog.save()
        response.status(201).end()
    }else{
        response.status(404).end()
    }
})

  
module.exports = postsRouter