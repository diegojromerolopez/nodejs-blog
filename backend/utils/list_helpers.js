const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc,blogI)=>acc + blogI.likes, 0)

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map((blogI)=>blogI.likes))
    return blogs.filter((blogI) => maxLikes === blogI.likes)[0]
}

const mostBlogs = (blogs) => {
    let maxAuthor = null
    let maxBlogs = null

    const authors = blogs.map((blogI)=>blogI.author)
    const authorBlogCounts = _.countBy(authors)
    authors.forEach(author => {
        if(maxAuthor === null || maxBlogs < authorBlogCounts[author]){
            maxAuthor = author
            maxBlogs = authorBlogCounts[author]
        }
    })
    return { author: maxAuthor, blogs: maxBlogs}
}

const mostLikes = (blogs) => {
    let maxAuthor = null
    let maxLikes = null

    const authors = blogs.map((blogI) => blogI.author)
    authors.forEach(author => {
        const authorLikes = blogs
            .filter(blogI => blogI.author === author)
            .map(blogI => blogI.likes)
            .reduce((a, b) => a + b, 0)
        if(maxAuthor === null || maxLikes < authorLikes){
            maxAuthor = author
            maxLikes = authorLikes
        }
    })
    return { author: maxAuthor, likes: maxLikes}
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}