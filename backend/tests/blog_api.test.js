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
    const blog = new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog.save()

    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const respondedBlogs = response.body
    expect(respondedBlogs).toHaveLength(1)
    expect(respondedBlogs[0].title).toBe(blog.title)
    expect(respondedBlogs[0].author).toBe(blog.author)
    expect(respondedBlogs[0].url).toBe(blog.url)
    expect(respondedBlogs[0].creationDate).toBe(blog.creationDate.toISOString())
})

test('blog is created', async () => {
    await api
        .post('/api/blogs')
        .send({
            'title': 'John Titor\'s Blog: A look into the future',
            'author': 'John Titor',
            'url': 'http://example.com'
        })
        .expect(204)
})

test('blog without title is not created', async () => {
    await api
        .post('/api/blogs')
        .send({
            'author': 'John Titor',
            'url': 'http://example.com'
        })
        .expect(400)
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