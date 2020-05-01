const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (_request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    blog.creationDate = new Date()
    await blog.save()    
    response.status(204).end()
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
    const updatedBlog = await Blog.findOneAndUpdate({'_id': request.params.blogId}, updatedAttributes, {new: true})
    if(updatedBlog){
        response.json(updatedBlog.toJSON())
    }else{
        response.status(404).end()
    }
})

blogsRouter.delete('/:blogId', async (request, response) => {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.blogId)
    if(deletedBlog){
        response.status(201).end()
    }else{
        response.status(404).end()
    }
})

  
module.exports = blogsRouter