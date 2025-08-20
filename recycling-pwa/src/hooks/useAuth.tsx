import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  binId: string;
  binLocation: string;
  totalPoints: number;
  bottlesRecycled: number;
  badgesEarned: number;
  nftTokens: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (binId: string, binLocation: string) => Promise<void>;
  logout: () => void;
  updateUserStats: (stats: Partial<User>) => void;
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
      const binId = localStorage.getItem('binId');
      const binLocation = localStorage.getItem('binLocation');
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      if (binId && binLocation && isLoggedIn === 'true') {
        // In a real app, validate with backend
        const mockUser: User = {
          id: '1',
          binId,
          binLocation,
          totalPoints: 1250,
          bottlesRecycled: 25,
          badgesEarned: 2,
          nftTokens: 1,
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (binId: string, binLocation: string) => {
    try {
      // Store authentication data
      localStorage.setItem('binId', binId);
      localStorage.setItem('binLocation', binLocation);
      localStorage.setItem('isLoggedIn', 'true');

      // Create user object
      const newUser: User = {
        id: '1',
        binId,
        binLocation,
        totalPoints: 0,
        bottlesRecycled: 0,
        badgesEarned: 0,
        nftTokens: 0,
      };

      setUser(newUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('binId');
    localStorage.removeItem('binLocation');
    localStorage.removeItem('isLoggedIn');
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
    logout,
    updateUserStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

