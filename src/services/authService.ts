import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://netflix-login-chi.vercel.app/api' 
  : 'http://localhost:5000/api';

export interface User {
  id: number;
  userId: string;
  username: string;
  email: string;
  phoneNumber?: string;
  createdAt?: string;
}

export interface RegisterData {
  userId: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      const { token } = response.data;
      
      this.setToken(token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  // Login user
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      const { token } = response.data;
      
      this.setToken(token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  // Get user profile
  async getProfile(): Promise<{ user: User }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  // Test database connection
  async testDatabase(): Promise<{ message: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/test-db`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Database test failed');
    }
  }

  // Set token in localStorage and instance variable
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
    
    // Set default axios header for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Get token
  getToken(): string | null {
    return this.token || localStorage.getItem('authToken');
  }

  // Remove token (logout)
  removeToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get current user data from token
  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: 0, // Will be populated from profile
        userId: payload.userId,
        username: payload.username,
        email: '',
        phoneNumber: ''
      };
    } catch {
      return null;
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
