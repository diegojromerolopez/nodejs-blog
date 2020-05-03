const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const authRouter = require('express').Router()

authRouter.post('/login', async (request, response) => {
    const body = request.body
  
    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)
  
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }
  
    const userForToken = {
        username: user.username,
        id: user._id,
    }
  
    const token = jwt.sign(userForToken, process.env.SECRET)
  
    user.openSessionTokens.push(token)
    await user.save()

    response
        .status(200)
        .send({ token: token, user: user.toJSON() })
})

authRouter.post('/logout', middleware.currentUserFromToken, async (request, response) => {
    const user = request.currentUser
    // Return a 401 if the current token is being used by the user in a session
    if (user.openSessionTokens.filter(userToken => userToken == request.token).length > 0){
        user.openSessionTokens.pull(request.token)
        await user.save()
        return response.status(401).end()
    }
    response.status(200).end()
})

module.exports = authRouter



