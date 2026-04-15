import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export async function fetchMedicines(search = '') {
  const response = await api.get('/medicines', {
    params: search ? { search } : {},
  })

  return response.data
}

export async function fetchMedicine(id) {
  const response = await api.get(`/medicines/${id}`)

  return response.data
}

export async function createMedicine(payload) {
  const response = await api.post('/medicines', payload)

  return response.data
}

export async function updateMedicine(id, payload) {
  const response = await api.put(`/medicines/${id}`, payload)

  return response.data
}

export async function deleteMedicine(id) {
  const response = await api.delete(`/medicines/${id}`)

  return response.data
}

export async function requestCredentialRecovery(payload) {
  const response = await api.post('/auth/forgot-credentials', payload)

  return response.data
}

export async function verifyCredentialRecovery(payload) {
  const response = await api.post('/auth/verify-recovery-code', payload)

  return response.data
}