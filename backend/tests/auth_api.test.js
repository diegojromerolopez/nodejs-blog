const bcrypt = require('bcrypt')
const express = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
app.use(express.json())
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    
    const username = 'johntitor'
    const password = 'johntitor_password'
    this.user = new User({
        username: username,
        email: 'johntitor@example.com',
        name: 'John Titor',
        passwordHash: await bcrypt.hash(password, 10),
        creationDate: new Date(),
    })
    await this.user.save()
    this.username = username
    this.password = password
})

test('login OK', async () => {
    const response = await api
        .post('/api/auth/login')
        .send({
            username: this.username,
            password: this.password
        })
        .expect(200)
    
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
    expect(response.body.user.id).toBe(this.user._id.toString())
})

afterAll(() => {
    mongoose.connection.close()
})