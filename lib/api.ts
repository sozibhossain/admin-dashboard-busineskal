import axiosInstance from './axios'

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  name: string
  email: string
  role: string
  _id: string
}

class ApiClient {
  private axiosInstance = axiosInstance

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      { email, password }
    )
    return response.data
  }

  async forgotPassword(email: string) {
    const response = await this.axiosInstance.post<ApiResponse>(
      '/auth/forget',
      { email }
    )
    return response.data
  }

  async verifyOtp(email: string, otp: string) {
    const response = await this.axiosInstance.post<ApiResponse>(
      '/auth/verify',
      { email, otp }
    )
    return response.data
  }

  async resetPassword(email: string, otp: string, password: string) {
    const response = await this.axiosInstance.post<ApiResponse>(
      '/auth/reset-password',
      { email, otp, password }
    )
    return response.data
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await this.axiosInstance.post<ApiResponse>(
      '/auth/change-password',
      { oldPassword, newPassword }
    )
    return response.data
  }

  async refreshToken(refreshToken: string) {
    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/refresh-token',
      { refreshToken }
    )
    return response.data
  }
}

export const apiClient = new ApiClient()
