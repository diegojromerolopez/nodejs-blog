const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.set('useFindAndModify', false)

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 8,
        unique: true
    },
    author: {
        type: String,
        required: true,
        minlength: 8
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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }]
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
