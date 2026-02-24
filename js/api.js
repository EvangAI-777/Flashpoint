import { API_BASE } from './config.js';

export async function fetchJson(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
}
