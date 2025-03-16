import axios from 'axios';


const apiUtilisateur = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

export default apiUtilisateur;
