const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

blogsRouter.use(middleware.currentUserFromToken)

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({creator: request.currentUser._id})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/all', async (request, response) => {
    const blogs = await Blog.find({}).populate('creator')
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
    const currentUser = await User.findById(request.currentUser._id)
    const blog = new Blog(request.body)
    blog.creationDate = new Date()
    blog.creator = currentUser._id
    await blog.save()
    currentUser.blogs.push(blog)
    await currentUser.save()
    response.json(blog.toJSON())
})

blogsRouter.put('/:blogId', async (request, response) => {
    const updatedAttributes = {}
    for(let attribute of ['title', 'author', 'url', 'likes']){
        if(request.body[attribute]){
            updatedAttributes[attribute] = request.body[attribute]
        }
    }
    if(Object.keys(updatedAttributes).length === 0){
        return response.status(400).end()
    }
    const updatedBlog = await Blog.findOneAndUpdate(
        {'_id': request.params.blogId, creator: request.currentUser._id},
        updatedAttributes,
        {new: true}
    )
    if(updatedBlog){
        response.json(updatedBlog.toJSON())
    }else{
        response.status(404).end()
    }
})

blogsRouter.delete('/:blogId', async (request, response) => {
    const deletedBlog = await Blog.findOneAndRemove(
        {'_id': request.params.blogId, creator: request.currentUser._id}
    )
    if(deletedBlog){
        response.status(200).end()
    }else{
        response.status(404).end()
    }
})

  
module.exports = blogsRouter