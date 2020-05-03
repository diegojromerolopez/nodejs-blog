const mongoose = require('mongoose')
require('mongoose-type-email')
const Schema = mongoose.Schema

mongoose.set('useFindAndModify', false)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    superuser: {
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        required: true
    },
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }],
    openSessionTokens: {
        type: [String],
        required: true
    },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.superuser
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)
