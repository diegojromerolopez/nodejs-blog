const express = require('express')
const supertest = require('supertest')
const app = require('../app')
app.use(express.json())
const api = supertest(app)


test('invalid URL', async () => {
    await api
        .get('/api/this/url/does/not/exist')
        .expect(404)
})
