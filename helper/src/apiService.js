import axios from 'axios';

const API_URL = 'http://localhost:8000'; // replace with your FastAPI server url

export function getItems() {
    return axios.get(`${API_URL}/items/`)
        .catch(error => {
            throw error;
        });
}

export function getItem(title) {
    return axios.get(`${API_URL}/items/${title}`)
        .catch(error => {
            throw error;
        });
}

export function createItem(item) {
    return axios.post(`${API_URL}/items/`, item)
        .catch(error => {
            throw error;
        });
}

export function updateItem(title, item) {
    return axios.put(`${API_URL}/items/${title}`, item)
        .catch(error => {
            throw error;
        });
}

export function deleteItem(title) {
    return axios.delete(`${API_URL}/items/${title}`)
        .catch(error => {
            throw error;
        });
}