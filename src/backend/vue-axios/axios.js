import axios from 'axios';

const API_URL = '/api';

var daxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

daxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    switch (error.response.status) {
      case 401 :
        if(error.response.data.error){
          alert(error.response.data.error);
        }
        else{
          window.location='/';
          return 200;
        }
        break;
      case 422 :
        alert(error.response.request.responseText);
        break;
      default:
        alert(error.response.request.statusText);
      
    }
    return Promise.reject(error);
  });

daxios.interceptors.request.use(
  (config) => {
    config.headers.authorization = 'Bearer ' + localStorage.getItem('bearer_token');
    return config;
  }
);

export default daxios;
