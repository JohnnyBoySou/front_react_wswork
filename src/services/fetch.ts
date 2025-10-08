const BASE_URL = 'https://back-java-spring-boot.onrender.com/';

function customFetch(url: string, options: RequestInit & { params?: Record<string, string> }) {
    return window.fetch(BASE_URL + url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options.params && {
            params: options.params
        }
    });
} 

export default customFetch;
