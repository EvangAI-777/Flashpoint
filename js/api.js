import { API_BASE } from './config.js';

export async function fetchJson(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    return response.json();
}
