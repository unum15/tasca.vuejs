import axios from 'axios';

const API_URL = '/api';

var daxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

daxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    switch (error.response.status) {
      case 401 :
        window.location='/';
        return 200;
      case 422 :
        alert(error.response.request.responseText);
        break;
      default:
        alert(error.response.request.statusText);
      
    }
    return Promise.reject(error);
  })

daxios.interceptors.request.use(
  function (config) {
    config.headers.authorization = 'Bearer ' + localStorage.getItem('bearer_token');
    return config;
  }
)

export default daxios;
