const express = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
app.use(express.json())
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
})

test('blogs are returned as json', async () => {
    const blog1 = new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog1.save()

    const blog2 = new Blog({
        'title': 'John Doe\'s Blog: A look into the past',
        'author': 'John Doe',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog2.save()

    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const respondedBlogs = response.body
    expect(respondedBlogs).toHaveLength(2)

    const respondedBlog1 = respondedBlogs[0]
    expect(respondedBlog1.id).toBe(blog1._id.toString())
    expect(respondedBlog1.title).toBe(blog1.title)
    expect(respondedBlog1.author).toBe(blog1.author)
    expect(respondedBlog1.url).toBe(blog1.url)
    expect(respondedBlog1.creationDate).toBe(blog1.creationDate.toISOString())

    const respondedBlog2 = respondedBlogs[1]
    expect(respondedBlog2.id).toBe(blog2._id.toString())
    expect(respondedBlog2.title).toBe(blog2.title)
    expect(respondedBlog2.author).toBe(blog2.author)
    expect(respondedBlog2.url).toBe(blog2.url)
    expect(respondedBlog2.creationDate).toBe(blog2.creationDate.toISOString())
})

test('blog is created', async () => {
    const newBlogData = {
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'likes': 5 
    }
    await api
        .post('/api/blogs')
        .send(newBlogData)
        .expect(204)
    
    const blogCount = await Blog.count({})
    expect(blogCount).toBe(1)

    const createdBlog = await Blog.findOne({})
    expect(createdBlog.title).toBe(newBlogData.title)
    expect(createdBlog.author).toBe(newBlogData.author)
    expect(createdBlog.url).toBe(newBlogData.url)
    expect(createdBlog.likes).toBe(newBlogData.likes)
})

test('blog without likes is created', async () => {
    const newBlogData = {
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com'
    }
    await api
        .post('/api/blogs')
        .send(newBlogData)
        .expect(204)
    
    const blogCount = await Blog.count({})
    expect(blogCount).toBe(1)

    const createdBlog = await Blog.findOne({})
    expect(createdBlog.title).toBe(newBlogData.title)
    expect(createdBlog.author).toBe(newBlogData.author)
    expect(createdBlog.url).toBe(newBlogData.url)
    expect(createdBlog.likes).toBe(0)
})

test('blog without title is not created', async () => {
    await api
        .post('/api/blogs')
        .send({
            'author': 'John Titor',
            'url': 'http://example.com'
        })
        .expect(400)
    const blogCount = await Blog.count({})
    expect(blogCount).toBe(0)
})

test('blog without url is not created', async () => {
    await api
        .post('/api/blogs')
        .send({
            'title': 'John Titor\'s Blog: A look into the future',
            'author': 'John Titor'
        })
        .expect(400)
    const blogCount = await Blog.count({})
    expect(blogCount).toBe(0)
})

test('blog with repeated name is not created', async () => {
    const blog = new Blog({
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog.save()
    await api
        .post('/api/blogs')
        .send({
            'title': 'John Titor\'s Blog: A look into the future',
            'author': 'John Titor',
            'url': 'http://example.com'
        })
        .expect(400)
})



test('blog is deleted', async () => {
    const blog = await (new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date()
    })).save()

    await api
        .delete(`/api/blogs/${blog.id}`)
        .expect(201)
})

afterAll(() => {
    mongoose.connection.close()
})