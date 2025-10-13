import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  binId?: string;
  binLocation?: string;
  totalPoints: number;
  bottlesRecycled: number;
  badgesEarned: number;
  nftTokens: number;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (binId: string, binLocation: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string, profileImage?: File | null) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUserStats: (stats: Partial<User>) => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: File | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (binId: string, binLocation: string) => {
    try {
      // Create user object for QR login
      const newUser: User = {
        id: `qr-${Date.now()}`,
        name: 'QR User',
        email: `qr-${Date.now()}@recycling.com`,
        binId,
        binLocation,
        totalPoints: 0,
        bottlesRecycled: 0,
        badgesEarned: 0,
        nftTokens: 0,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store authentication data
      const token = `qr-token-${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));

      setUser(newUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const loginWithCredentials = async (email: string, password: string, profileImage?: File | null) => {
    try {
      // Import the API service
      const { apiService } = await import('../services/apiService');
      
      // Make API call to backend
      const response = await apiService.login({ email, password });
      
      // Store authentication data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));

      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      // Import the API service
      const { apiService } = await import('../services/apiService');
      
      // Make API call to backend
      const response = await apiService.signup(userData);
      
      // Store authentication data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));

      setUser(response.user);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const updateUserStats = (stats: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...stats });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithCredentials,
    signup,
    logout,
    updateUserStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


