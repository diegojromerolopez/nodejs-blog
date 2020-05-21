import axios from 'axios'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const config = {
        headers: { Authorization: token },
      }
    const request = axios.get('/api/blogs/all', config)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {headers: { Authorization: token }}
    const response = await axios.post('/api/blogs', newObject, config)
    return response.data
}

const update = (id, updatedFields) => {
    const config = {headers: { Authorization: token }}
    const request = axios.put(`/api/blogs/${id}`, updatedFields, config)
    return request.then(response => response.data)
}

const like = async (id) => {
    const config = {headers: { Authorization: token }}
    const response = await axios.put(`/api/blogs/${id}/like`, null, config)
    return response.data
}

const unlike = async (id) => {
    const config = {headers: { Authorization: token }}
    const response = await axios.put(`/api/blogs/${id}/unlike`, null, config)
    return response.data
}

const deleteBlog = async (id) => {
    const config = {headers: { Authorization: token }}
    const response = await axios.delete(`/api/blogs/${id}`, config)
    return response.data
}


export default { getAll, create, update, setToken, like, unlike, deleteBlog }
