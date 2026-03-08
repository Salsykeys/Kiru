//import axios
import axios from 'axios';

//import js cookie
import Cookies from 'js-cookie';

const Api = axios.create({
    //set default endpoint API
    baseURL: import.meta.env.VITE_APP_BASEURL
})

// Handle request - attach tokens
Api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    const customerToken = Cookies.get('customerToken');

    // Prioritize customerToken if on customer routes
    if (window.location.pathname.startsWith('/customer')) {
        if (customerToken) {
            config.headers.Authorization = `Bearer ${customerToken}`;
        }
    } else {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (customerToken) {
            // Fallback to customer token if no staff token exists
            config.headers.Authorization = `Bearer ${customerToken}`;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


//handle unathenticated
Api.interceptors.response.use(function (response) {

    //return response
    return response;
}, ((error) => {

    //check if response unauthenticated
    if (error.response && 401 === error.response.status) {

        // Jika 401 terjadi di halaman login, jangan redirect — biarkan komponen handle errornya
        const isLoginPage = window.location.pathname === '/login' ||
            window.location.pathname === '/login/staff' ||
            window.location.pathname === '/customer/register';

        if (isLoginPage) {
            return Promise.reject(error);
        }

        //remove all possible tokens
        Cookies.remove('token');
        Cookies.remove('customerToken');
        Cookies.remove('user');
        Cookies.remove('customer');

        // Check where to redirect
        if (window.location.pathname.startsWith('/customer')) {
            window.location = '/login';
        } else if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/users')) {
            window.location = '/login/staff';
        } else {
            window.location = '/';
        }
    } else {

        //reject promise error
        return Promise.reject(error);
    }
}));

export default Api
