const express = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
app.use(express.json())
const api = supertest(app)
const Blog = require('../models/blog')
const Post = require('../models/post')

beforeEach(async () => {
    await Post.deleteMany({})
    await Blog.deleteMany({})
})

test('post is created', async () => {
    const blog = new Blog({
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog.save()
    
    const newPostData = {
        'title': 'World War III',
        'content': 'World War III started as a conflict between Oceania and Europia',
        'url': 'http://example.com/wwiii',
        'likes': 0
    }
    await api
        .post(`/api/blogs/${blog._id}/posts`)
        .send(newPostData)
        .expect(204)
    
    const blogCount = await Blog.count({})
    expect(blogCount).toBe(1)

    const postCount = await Post.count({})
    expect(postCount).toBe(1)

    const createdPost = await Post.findOne({})
    expect(createdPost.title).toBe(newPostData.title)
    expect(createdPost.author).toBe(newPostData.author)
    expect(createdPost.url).toBe(newPostData.url)
    expect(createdPost.likes).toBe(newPostData.likes)
    expect(createdPost.blog.toString()).toBe(blog._id.toString())
})

test('post is deleted', async () => {
    const blog = new Blog({
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog.save()

    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': blog._id
    })
    await post.save()

    blog.posts.push(post)
    await blog.save()
    
    await api
        .delete(`/api/blogs/${blog._id}/posts/${post._id}`)
        .expect(201)

    const postCount = await Post.count({})
    expect(postCount).toBe(0)

    const dbBlog = await Blog.findOne({})
    expect(dbBlog.posts.length).toBe(0)
})

test('post has content updated', async () => {
    const blog = new Blog({
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog.save()

    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': blog._id
    })
    await post.save()

    blog.posts.push(post)
    await blog.save()
    
    const newContent = 'Jonh Titor does not exits'
    await api
        .put(`/api/blogs/${blog._id}/posts/${post._id}`)
        .send({'content': newContent})
        .expect(200)

    const updatedPost = await Post.findOne({})
    expect(updatedPost.content).toBe(newContent)
})

afterAll(() => {
    mongoose.connection.close()
})

test('post has likes updated', async () => {
    const blog = new Blog({
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date()
    })
    await blog.save()

    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': blog._id
    })
    await post.save()

    blog.posts.push(post)
    await blog.save()
    
    await api
        .put(`/api/blogs/${blog._id}/posts/${post._id}`)
        .send({'likes': 10})
        .expect(200)

    const updatedPost = await Post.findOne({})
    expect(updatedPost.likes).toBe(10)
})

afterAll(() => {
    mongoose.connection.close()
})