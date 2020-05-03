const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
app.use(express.json())
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const Post = require('../models/post')

beforeEach(async () => {
    await User.deleteMany({})
    await Post.deleteMany({})
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
    const blog = new Blog({
        'title': 'John Titor\'s Blog: A look into the future',
        'author': 'John Titor',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'creator': user._id
    })
    await blog.save()
    const response = await api
        .post('/api/auth/login')
        .send({
            username: user.username,
            password: password
        })
    this.token = response.body.token
    this.currentUser = user
    this.blog = blog
})

test('get all posts', async () => {
    const post1 =new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': this.blog._id,
        'creator': this.currentUser._id
    })
    await post1.save()
    await this.blog.posts.push(post1._id)
    
    const post2 = new Post({
        'title': 'Hipster guy is an imposter',
        'content': 'Hipster guy is an imposter...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': this.blog._id,
        'creator': this.currentUser._id
    })
    await post2.save()
    await this.blog.posts.push(post2._id)

    const response = await api
        .get(`/api/blogs/${this.blog._id}/posts`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)

    const posts = response.body
    expect(posts).toHaveLength(2)

    expect(posts[0].title).toBe(post1.title)
    expect(posts[0].author).toBe(post1.author)
    expect(posts[0].url).toBe(post1.url)
    expect(posts[0].likes).toBe(post1.likes)
    expect(posts[0].creator.id.toString()).toBe(post1.creator.toString())

    expect(posts[1].title).toBe(post2.title)
    expect(posts[1].author).toBe(post2.author)
    expect(posts[1].url).toBe(post2.url)
    expect(posts[1].likes).toBe(post2.likes)
    expect(posts[1].creator.id.toString()).toBe(post2.creator.toString())
})
test('post is created', async () => {
    const newPostData = {
        'title': 'World War III',
        'content': 'World War III started as a conflict between Oceania and Europia',
        'url': 'http://example.com/wwiii',
        'likes': 0
    }
    await api
        .post(`/api/blogs/${this.blog._id}/posts`)
        .send(newPostData)
        .set('Authorization', `Bearer ${this.token}`)
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
    expect(createdPost.blog.toString()).toBe(this.blog._id.toString())
    expect(createdPost.creator.toString()).toBe(this.currentUser._id.toString())
})

test('post has content updated', async () => {
    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': this.blog._id,
        'creator': this.currentUser._id
    })
    await post.save()

    this.blog.posts.push(post)
    await this.blog.save()
    
    const newContent = 'Jonh Titor does not exits'
    await api
        .put(`/api/blogs/${this.blog._id}/posts/${post._id}`)
        .send({'content': newContent})
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)

    const updatedPost = await Post.findOne({})
    expect(updatedPost.content).toBe(newContent)
})

test('post has likes updated', async () => {
    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': this.blog._id,
        'creator': this.currentUser._id
    })
    await post.save()

    this.blog.posts.push(post)
    await this.blog.save()
    
    await api
        .put(`/api/blogs/${this.blog._id}/posts/${post._id}`)
        .send({'likes': 10})
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)

    const updatedPost = await Post.findOne({})
    expect(updatedPost.likes).toBe(10)
})

test('post not updated, no data sent', async () => {
    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': this.blog._id,
        'creator': this.currentUser._id
    })
    await post.save()

    await api
        .put(`/api/blogs/${this.blog._id}/posts/${post._id}`)
        .send({})
        .set('Authorization', `Bearer ${this.token}`)
        .expect(400)
    const nonUpdatedPost = await Post.findOne({})
    expect(nonUpdatedPost.title).toBe(post.title)
    expect(nonUpdatedPost.content).toBe(post.content)
    expect(nonUpdatedPost.url).toBe(post.url)
    expect(nonUpdatedPost.likes).toBe(post.likes)
})

test('post not updated, post not found', async () => {
    await api
        .put(`/api/blogs/${this.blog._id}/posts/41224d776a326fb40f000001`)
        .send({
            'title': 'This is a new title'
        })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(404)
})

test('post is deleted', async () => {
    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': this.blog._id,
        'creator': this.currentUser._id
    })
    await post.save()

    this.blog.posts.push(post)
    await this.blog.save()
    
    await api
        .delete(`/api/blogs/${this.blog._id}/posts/${post._id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)

    const postCount = await Post.count({})
    expect(postCount).toBe(0)

    const dbBlog = await Blog.findOne({})
    expect(dbBlog.posts.length).toBe(0)
})

test('post is not deleted, because is not found', async () => {
    const post = new Post({
        'title': 'John Titor\'s Blog: A look into the future',
        'content': 'John Titor goes to the World War III and finds...',
        'url': 'http://example.com',
        'creationDate': new Date(),
        'blog': this.blog._id,
        'creator': this.currentUser._id
    })
    await post.save()

    this.blog.posts.push(post)
    await this.blog.save()
    
    await api
        .delete(`/api/blogs/${this.blog._id}/posts/41224d776a326fb40f000001`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(404)

    const postCount = await Post.count({})
    expect(postCount).toBe(1)

    const dbBlog = await Blog.findOne({})
    expect(dbBlog.posts.length).toBe(1)
})

afterAll(() => {
    mongoose.connection.close()
})
