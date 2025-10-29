import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Types
export interface ApiResponse<T> {
  success: true
  data: T
}

export interface ApiError {
  error: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

// Auth API
export const authApi = {
  demoLogin: (role: 'ADMIN' | 'MANAGER' = 'ADMIN') =>
    api.post<ApiResponse<{ token: string; user: any }>>('/auth/demo', { role }),
}

// Categories API
export const categoriesApi = {
  getAll: () => api.get<ApiResponse<any[]>>('/categories'),
  getById: (id: number) => api.get<ApiResponse<any>>(`/categories/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/categories', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/categories/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/categories/${id}`),
}

// Tours API
export const toursApi = {
  getAll: (params?: any) => api.get<ApiResponse<any[]>>('/tours', { params }),
  getById: (id: number) => api.get<ApiResponse<any>>(`/tours/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/tours', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/tours/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/tours/${id}`),
  publish: (id: number) => api.patch<ApiResponse<any>>(`/tours/${id}/publish`),
  unpublish: (id: number) => api.patch<ApiResponse<any>>(`/tours/${id}/unpublish`),
}

// Tour Dates API
export const tourDatesApi = {
  getAll: (params?: any) => api.get<ApiResponse<any[]>>('/dates', { params }),
  getById: (id: number) => api.get<ApiResponse<any>>(`/dates/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/dates', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/dates/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/dates/${id}`),
}

// Bookings API
export const bookingsApi = {
  getAll: (params?: any) => api.get<ApiResponse<any[]>>('/bookings', { params }),
  getById: (id: number) => api.get<ApiResponse<any>>(`/bookings/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/bookings', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/bookings/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/bookings/${id}`),
  markPaid: (id: number) => api.patch<ApiResponse<any>>(`/bookings/${id}/paid`),
  cancel: (id: number) => api.patch<ApiResponse<any>>(`/bookings/${id}/cancel`),
}

// Leads API
export const leadsApi = {
  getAll: (params?: any) => api.get<ApiResponse<any[]>>('/leads', { params }),
  getById: (id: number) => api.get<ApiResponse<any>>(`/leads/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/leads', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/leads/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/leads/${id}`),
  convertToBooking: (id: number, data: any) => api.post<ApiResponse<any>>(`/leads/${id}/convert`, data),
}

// Customers API
export const customersApi = {
  getAll: (params?: any) => api.get<ApiResponse<any[]>>('/customers', { params }),
  getById: (id: number) => api.get<ApiResponse<any>>(`/customers/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/customers', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/customers/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/customers/${id}`),
  getTimeline: (id: number) => api.get<ApiResponse<any>>(`/customers/${id}/timeline`),
}

// Users API
export const usersApi = {
  getAll: () => api.get<ApiResponse<any[]>>('/users'),
  getById: (id: number) => api.get<ApiResponse<any>>(`/users/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/users', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/users/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/users/${id}`),
}

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get<ApiResponse<any>>('/dashboard/stats'),
}
