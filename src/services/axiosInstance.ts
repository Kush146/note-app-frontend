import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api', // match your backend PORT
    withCredentials: true,
});

export default instance;
