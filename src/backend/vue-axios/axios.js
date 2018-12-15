import axios from 'axios'

const API_URL = '/api'

var daxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

daxios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    console.log(error)
    switch (error.response.status) {
      case 401 :
        this.$router.push('/')
        return 200
      case 422 :
        alert(error.response.request.responseText)
        break;
      default:
        alert(error.response.request.statusText)
      
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
