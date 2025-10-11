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
      // In a real app, this would make an API call to your backend
      // For now, we'll simulate the login process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from backend validation
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0], // Use email prefix as name for demo
        email,
        phone: '',
        profileImage: profileImage ? URL.createObjectURL(profileImage) : undefined,
        totalPoints: 0,
        bottlesRecycled: 0,
        badgesEarned: 0,
        nftTokens: 0,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store authentication data
      const token = `auth-token-${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(mockUser));

      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll simulate the signup process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        profileImage: userData.profileImage ? URL.createObjectURL(userData.profileImage) : undefined,
        totalPoints: 0,
        bottlesRecycled: 0,
        badgesEarned: 0,
        nftTokens: 0,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store authentication data
      const token = `auth-token-${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));

      setUser(newUser);
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


