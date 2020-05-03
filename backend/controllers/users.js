const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({superuser: false}).populate('blogs')
    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    // Check password is present
    if (body.password === undefined || body.password === '' || body.password === null) {
        return response.status(400).json({ error: 'password missing' })
    }
    // Check password is at least 3 characters length
    if (body.password.length < 3) {
        return response.status(400).json(
            { error: 'password is too short (3 characters are the minimum)' }
        )
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        email: body.email,
        creationDate: new Date(),
        passwordHash,
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

module.exports = usersRouter