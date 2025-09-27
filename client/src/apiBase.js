// API base configuration: use localhost during local development, otherwise
// point to the deployed backend service.
const LOCAL = "http://127.0.0.1:5555";
const PROD = "https://phase4-project-backend.onrender.com";

let hostname = '';
if (typeof window !== 'undefined' && window.location && window.location.hostname) {
	hostname = window.location.hostname;
}

export const BASE_URL = (hostname === 'localhost' || hostname === '127.0.0.1') ? LOCAL : PROD;