import axios from "axios";

const api = axios.create({
    baseURL: 'https://don-napoli-pizzaria-back-end.vercel.app/'
});

export { api };