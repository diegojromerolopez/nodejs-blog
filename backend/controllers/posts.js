const middleware = require('../utils/middleware')
const postsRouter = require('express').Router({ mergeParams: true })
const Blog = require('../models/blog')
const Post = require('../models/post')

postsRouter.use(middleware.currentUserFromToken)

postsRouter.get('/', async (request, response) => {
    const posts = await Post.find(
        {blog: request.params.blogId, creator: request.currentUser._id}
    ).populate('creator')
    response.json(posts.map(post => post.toJSON()))
})

postsRouter.post('/', async (request, response) => {
    // Find the blog parent
    const blog = await Blog.findOne(
        {'_id': request.params.blogId, creator: request.currentUser._id}
    )
    // Post creation
    const post = new Post({blog: blog._id, creator: request.currentUser._id, ...request.body})
    post.creationDate = new Date()
    await post.save()    
    // Update blog part
    blog.posts.push(post)
    await blog.save()
    // HTTP response
    response.json(post.toJSON())
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
        {blog: request.params.blogId, creator: request.currentUser._id, _id: request.params.postId},
        updatedAttributes,
        {new: true}
    )
    if(updatedPost){
        response.json(updatedPost.toJSON())
    }else{
        response.status(404).end()
    }
})

postsRouter.put('/:postId/like', async (request, response) => {
    const updatedPost = await Post.findOneAndUpdate(
        {blog: request.params.blogId, _id: request.params.postId, 'likers': {'$nin': request.currentUser._id}},
        {'$inc': {'likes': 1}, '$addToSet': {'likers': request.currentUser._id}},
        {new: true}
    )
    if(updatedPost){
        response.json(updatedPost.toJSON())
    }else{
        response.status(404).end()
    }
})

postsRouter.put('/:postId/unlike', async (request, response) => {
    const updatedPost = await Post.findOneAndUpdate(
        {blog: request.params.blogId, _id: request.params.postId, 'likers': {'$in': request.currentUser._id}},
        {'$inc': {'likes': -1}, '$pull': {'likers': request.currentUser._id}},
        {new: true}
    )
    if(updatedPost){
        response.json(updatedPost.toJSON())
    }else{
        response.status(404).end()
    }
})

postsRouter.delete('/:postId', async (request, response) => {
    const deletedPost = await Post.findOneAndDelete(
        {blog: request.params.blogId, creator: request.currentUser._id, _id: request.params.postId}
    )
    if(deletedPost){
        const blog = await Blog.findById(request.params.blogId)
        blog.posts.pull(request.params.postId)
        await blog.save()
        response.status(200).end()
    }else{
        response.status(404).end()
    }
})

  
module.exports = postsRouter