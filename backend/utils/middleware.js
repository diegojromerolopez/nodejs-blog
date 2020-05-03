const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const currentUserFromToken = async (request, response, next) => {
    // Get the token
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } else {
        request.token = null
    }
    
    // Make sure the token exists
    if(!request.token){
        return response.status(401).end()
    }

    // Get the user from the token
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        request.currentUser = null    
        return response.status(401).end()
    }
    request.currentUser = await User.findById(decodedToken.id)
    next()
}

const requestLogger = (request, _response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoError') {
        return response.status(400).json({ error: `Dabatase error: ${error.message}` })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({error: 'invalid token'})
    }
    console.log(error, error.name)
    next(error)
}

module.exports = {
    currentUserFromToken,
    requestLogger,
    unknownEndpoint,
    errorHandler
}