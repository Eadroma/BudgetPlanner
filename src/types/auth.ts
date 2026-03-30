export interface AuthUser {
  id: string
  email: string
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: AuthError | null
}
