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

    const user = await User.findById(this.user._id) 
    expect(user.openSessionTokens).toHaveLength(1)
    expect(user.openSessionTokens[0]).toHaveProperty('token', response.body.token)
    expect(user.openSessionTokens[0]).toHaveProperty('creationDate')
})

test('login not OK, invalid username', async () => {
    const response = await api
        .post('/api/auth/login')
        .send({
            username: 'invalid username',
            password: this.password
        })
        .expect(401)
    
    expect(response.body).toHaveProperty('error', 'invalid username or password')
})

test('login not OK, invalid password', async () => {
    const response = await api
        .post('/api/auth/login')
        .send({
            username: this.username,
            password: 'invalid password'
        })
        .expect(401)
    
    expect(response.body).toHaveProperty('error', 'invalid username or password')
})

test('logout OK', async () => {
    const loginResponse = await api
        .post('/api/auth/login')
        .send({
            username: this.username,
            password: this.password
        })
        .expect(200)

    const token = loginResponse.body.token
    await api
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
})

test('logout not OK, invalid token', async () => {
    await api
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401)
})

test('logout not OK, invalid header', async () => {
    await api
        .post('/api/auth/logout')
        .set('Authorization', 'Wearer invalidtoken')
        .expect(401)
})

afterAll(() => {
    mongoose.connection.close()
})