const bcrypt = require('bcrypt')
const express = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
app.use(express.json())
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    
    const password = 'johntitor_password'
    const user = new User({
        username: 'johntitor',
        email: 'johntitor@example.com',
        name: 'John Titor',
        passwordHash: await bcrypt.hash(password, 10),
        creationDate: new Date(),
    })
    await user.save()
    const response = await api
        .post('/api/auth/login')
        .send({
            username: user.username,
            password: password
        })
    this.token = response.body.token
    this.currentUser = user
})

test('all blogs are returned as json', async () => {
    const blog1 = new Blog({
        'title': 'John Titor\'s Blog: A look into the past',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })
    await blog1.save()

    const user = new User({
        username: 'hipster',
        email: 'hipster@example.com',
        name: 'The Time Travelling Hipster',
        passwordHash: await bcrypt.hash('hipster', 10),
        creationDate: new Date(),
    })
    await user.save()

    const blog2 = new Blog({
        'title': 'Time Travaler Hipster\'s Blog: went to Canada and returned',
        'author': 'Time Travaler Hipster',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': user._id
    })
    await blog2.save()

    const response = await api
        .get('/api/blogs/all')
        .set('Authorization', `Bearer ${this.token}`)
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
    expect(respondedBlog1.creator.id.toString()).toBe(blog1.creator.toString())

    const respondedBlog2 = respondedBlogs[1]
    expect(respondedBlog2.id).toBe(blog2._id.toString())
    expect(respondedBlog2.title).toBe(blog2.title)
    expect(respondedBlog2.author).toBe(blog2.author)
    expect(respondedBlog2.url).toBe(blog2.url)
    expect(respondedBlog2.creationDate).toBe(blog2.creationDate.toISOString())
    expect(respondedBlog2.creator.id.toString()).toBe(blog2.creator.toString())
})

test('blogs are returned as json', async () => {
    const blog1 = new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })
    await blog1.save()

    const blog2 = new Blog({
        'title': 'John Doe\'s Blog: A look into the past',
        'author': 'John Doe',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })
    await blog2.save()

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${this.token}`)
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
        .set('Authorization', `Bearer ${this.token}`)
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
        .set('Authorization', `Bearer ${this.token}`)
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
        .set('Authorization', `Bearer ${this.token}`)
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
        .set('Authorization', `Bearer ${this.token}`)
        .expect(400)
    const blogCount = await Blog.count({})
    expect(blogCount).toBe(0)
})

test('blog with repeated name is not created', async () => {
    const blog = new Blog({
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })
    await blog.save()
    await api
        .post('/api/blogs')
        .send({
            'title': 'John Titor\'s Blog: A look into the future',
            'author': 'John Titor',
            'url': 'http://example.com'
        })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(400)
})

test('blog has title updated', async () => {
    const blog = await (new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })).save()

    const newTitle = 'John Titor\'s Blog: A look into the future'
    await api
        .put(`/api/blogs/${blog.id}`)
        .send({
            'title': newTitle,
        })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
    const updatedBlog = await Blog.findOne({})
    expect(updatedBlog.title).toBe(newTitle)
})

test('blog has likes updated', async () => {
    const blog = await (new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })).save()

    await api
        .put(`/api/blogs/${blog.id}`)
        .send({
            'likes': 8
        })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
    const updatedBlog = await Blog.findOne({})
    expect(updatedBlog.likes).toBe(8)
})

test('blog not updated, blog not found', async () => {
    await api
        .put('/api/blogs/41224d776a326fb40f000001')
        .send({
            title: 'My title'
        })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(404)
})

test('blog not updated, no data sent', async () => {
    const blog = await (new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })).save()

    await api
        .put(`/api/blogs/${blog.id}`)
        .send({})
        .set('Authorization', `Bearer ${this.token}`)
        .expect(400)
    const nonUpdatedBlog = await Blog.findOne({})
    expect(nonUpdatedBlog.title).toBe(blog.title)
})

test('blog is deleted', async () => {
    const blog = await (new Blog({
        'title': 'Jack Doe\'s Blog: A look into the past',
        'author': 'Jack Doe',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': this.currentUser._id
    })).save()

    await api
        .delete(`/api/blogs/${blog.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
})

test('blog id doesn\'t exist, so is not deleted', async () => {
    await api
        .delete('/api/blogs/41224d776a326fb40f000001')
        .set('Authorization', `Bearer ${this.token}`)
        .expect(404)
})

afterAll(() => {
    mongoose.connection.close()
})