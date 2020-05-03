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
})

test('creation succeeds with all fields', async () => {
    const newUser = {
        username: 'johntitor',
        email: 'johntitor@example.com',
        name: 'Jonh Titor',
        password: 'wwiii'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const usersCountAtEnd = await User.count({})
    expect(usersCountAtEnd).toBe(1)

    const johnTitorsCount = await User.count({username: 'johntitor'})
    expect(johnTitorsCount).toBe(1)
})

test('creation succeeds without name field', async () => {
    const newUser = {
        username: 'johntitor',
        email: 'johntitor@example.com',
        password: 'wwiii'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const usersCountAtEnd = await User.count({})
    expect(usersCountAtEnd).toBe(1)

    const johnTitorsCount = await User.count({username: 'johntitor'})
    expect(johnTitorsCount).toBe(1)
})

test('creation fails because of no username', async () => {
    const newUser = {
        email: 'johntitor@example.com',
        name: 'Jonh Titor',
        password: 'wwiii'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersCountAtEnd = await User.count({})
    expect(usersCountAtEnd).toBe(0)
})

test('creation fails because of short password', async () => {
    const newUser = {
        email: 'johntitor@example.com',
        name: 'Jonh Titor',
        password: 'w'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    expect(response.body.error).toBe('password is too short (3 characters are the minimum)')
    const usersCountAtEnd = await User.count({})
    expect(usersCountAtEnd).toBe(0)
})

test('creation fails because of no email', async () => {
    const newUser = {
        username: 'johntitor',
        name: 'Jonh Titor',
        password: 'wwiii',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersCountAtEnd = await User.count({})
    expect(usersCountAtEnd).toBe(0)
})


test('fetch non superuser users', async () => {
    await (new User({
        username: 'root',
        email: 'root@example.com',
        name: 'Root',
        passwordHash: await bcrypt.hash('test_password', 10),
        creationDate: new Date(),
        superuser: true
    })).save()
    await (new User({
        username: 'johntitor',
        email: 'johntitor@example.com',
        name: 'Jonh Titor',
        passwordHash: await bcrypt.hash('test_password', 10),
        creationDate: new Date()
    })).save()

    const response = await api
        .get('/api/users')
        .expect(200)

    const users = response.body
    expect(users.length).toBe(1)
    
    expect(users[0].username).toBe('johntitor')
})

afterAll(() => {
    mongoose.connection.close()
})