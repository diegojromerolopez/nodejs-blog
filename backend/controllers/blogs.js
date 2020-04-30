const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (_request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)
    blog.creationDate = new Date()
    blog
        .save()
        .then(result => {
            if(result){
                response.status(204).end()
            }else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
    Blog
        .findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => next(error))
})

  
module.exports = blogsRouter