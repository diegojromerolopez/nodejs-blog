const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.set('useFindAndModify', false)

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 8,
        unique: true
    },
    content: {
        type: String,
        required: true,
        minlength: 8,
        unique: true
    },
    url: {
        type: String,
        required: true,
        minlength: 3
    },
    likes: {
        type: Number,
        default: 0
    },
    creationDate: {
        type: Date,
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.creator
    }
})

module.exports = mongoose.model('Post', postSchema)
