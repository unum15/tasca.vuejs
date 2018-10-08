import axios from 'axios'

const API_URL = '/api'

var daxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'apitoken': localStorage.getItem('token') // this is static so it doesn't work
  }
})

daxios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    console.log(error)
    if (error.status === 401) {
      this.$router.push('/')
      return 200
    }
    return Promise.reject(error)
  })

daxios.interceptors.request.use(
  function (config) {
    config.headers.apitoken = localStorage.getItem('token')
    return config
  }
)

export default daxios
