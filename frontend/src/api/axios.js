import axios from 'axios'

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
if (baseUrl && !baseUrl.endsWith('/api')) baseUrl = `${baseUrl}/api`

const api = axios.create({
  baseURL: baseUrl,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('hm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
