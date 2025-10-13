const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: 'user' | 'admin';
  totalPoints: number;
  bottlesRecycled: number;
  badgesEarned: number;
  nftTokens: number;
  createdAt: string;
  lastLogin: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // User Authentication
  async signup(userData: SignupData): Promise<AuthResponse> {
    // Transform the data to match backend API format
    const backendData = {
      displayName: userData.name,
      email: userData.email,
      password: userData.password
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Transform backend response to match frontend expectations
    return {
      user: {
        id: result.user.id,
        name: result.user.displayName,
        email: result.user.email,
        phone: userData.phone || '',
        role: 'user' as const,
        totalPoints: 0,
        bottlesRecycled: 0,
        badgesEarned: 0,
        nftTokens: 0,
        createdAt: result.user.createdAt,
        lastLogin: new Date().toISOString(),
      },
      token: result.token
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Transform backend response to match frontend expectations
    return {
      user: {
        id: result.user.id,
        name: result.user.displayName,
        email: result.user.email,
        phone: '',
        role: 'user' as const,
        totalPoints: 0,
        bottlesRecycled: 0,
        badgesEarned: 0,
        nftTokens: 0,
        createdAt: result.user.createdAt,
        lastLogin: result.user.lastLoginAt || new Date().toISOString(),
      },
      token: result.token
    };
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const result = await this.handleResponse<{ user: User }>(response);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get current user');
    }

    return result.data.user;
  }

  // User Management
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const result = await this.handleResponse<{ user: User }>(response);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to update user profile');
    }

    return result.data.user;
  }

  async uploadProfileImage(userId: string, imageFile: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-image`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeaders().Authorization!,
      },
      body: formData,
    });

    const result = await this.handleResponse<{ imageUrl: string }>(response);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to upload profile image');
    }

    return result.data;
  }

  // QR Code Login (for bin connection)
  async connectToBin(binData: { binId: string; location: string }): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/bins/connect`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(binData),
    });

    const result = await this.handleResponse<{ success: boolean }>(response);
    if (!result.success) {
      throw new Error(result.error || 'Failed to connect to bin');
    }

    return result.data || { success: false };
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  }
}

export const apiService = new ApiService();
export type { User, LoginCredentials, SignupData, AuthResponse, ApiResponse };
