
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  subscribedAreas?: SubscribedArea[];
  points?: number;
  badges?: Badge[];
}

export interface SubscribedArea {
  id: string;
  name: string;
  radius: number;
  location: {
    lat: number;
    lng: number;
  }
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  addPoints: (points: number) => void;
  awardBadge: (badge: Omit<Badge, 'id' | 'earnedAt'>) => void;
  subscribeToArea: (area: Omit<SubscribedArea, 'id'>) => void;
  unsubscribeFromArea: (areaId: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demo purposes
const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    subscribedAreas: [],
    points: 0,
    badges: []
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    subscribedAreas: [],
    points: 100,
    badges: [
      {
        id: 'badge-1',
        name: 'Admin',
        description: 'System administrator',
        icon: 'shield',
        earnedAt: new Date()
      }
    ]
  }
];

// Predefined badges
export const BADGES = {
  FIRST_REPORT: {
    name: 'First Report',
    description: 'Submitted your first road issue report',
    icon: 'flag'
  },
  HELPER: {
    name: 'Road Helper',
    description: 'Submitted 5 road issue reports',
    icon: 'help-circle'
  },
  ROAD_GUARDIAN: {
    name: 'Road Guardian',
    description: 'Submitted 10 road issue reports',
    icon: 'shield'
  },
  VERIFIER: {
    name: 'Verifier',
    description: 'Upvoted or downvoted 10 reports',
    icon: 'check-circle'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved authentication on mount
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setUser(parsedAuth.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we're using mock authentication
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const userData = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin,
            subscribedAreas: foundUser.subscribedAreas || [],
            points: foundUser.points || 0,
            badges: foundUser.badges || []
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Save to localStorage for persistence
          localStorage.setItem('auth', JSON.stringify({ user: userData }));
          
          toast.success('Logged in successfully!');
          setIsLoading(false);
          resolve();
        } else {
          toast.error('Invalid email or password');
          setIsLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // For demo purposes, we're using mock registration
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
          toast.error('Email already exists');
          setIsLoading(false);
          reject(new Error('Email already exists'));
          return;
        }
        
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
          isAdmin: false,
          subscribedAreas: [],
          points: 0,
          badges: []
        };
        
        // In a real app, you would send this to a server
        mockUsers.push(newUser);
        
        const userData = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          subscribedAreas: newUser.subscribedAreas,
          points: newUser.points,
          badges: newUser.badges
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Save to localStorage for persistence
        localStorage.setItem('auth', JSON.stringify({ user: userData }));
        
        // Award first badge
        awardBadge(BADGES.FIRST_REPORT);
        
        toast.success('Registered successfully!');
        setIsLoading(false);
        resolve();
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: 'Guest User',
      email: 'guest@example.com',
      isAdmin: false,
      subscribedAreas: [],
      points: 0,
      badges: []
    };
    
    setUser(guestUser);
    setIsAuthenticated(true);
    localStorage.setItem('auth', JSON.stringify({ user: guestUser }));
    toast.success('Continuing as guest');
  };

  const addPoints = (points: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      points: (user.points || 0) + points
    };
    
    setUser(updatedUser);
    localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
    toast.success(`Earned ${points} points!`);
    
    // Check for badge eligibility based on points
    if (updatedUser.points >= 50 && !user.badges?.some(b => b.name === BADGES.HELPER.name)) {
      awardBadge(BADGES.HELPER);
    }
    
    if (updatedUser.points >= 100 && !user.badges?.some(b => b.name === BADGES.ROAD_GUARDIAN.name)) {
      awardBadge(BADGES.ROAD_GUARDIAN);
    }
  };

  const awardBadge = (badgeInfo: Omit<Badge, 'id' | 'earnedAt'>) => {
    if (!user) return;
    
    // Check if user already has this badge
    if (user.badges?.some(b => b.name === badgeInfo.name)) {
      return;
    }
    
    const newBadge: Badge = {
      id: `badge-${Date.now()}`,
      name: badgeInfo.name,
      description: badgeInfo.description,
      icon: badgeInfo.icon,
      earnedAt: new Date()
    };
    
    const updatedUser = {
      ...user,
      badges: [...(user.badges || []), newBadge]
    };
    
    setUser(updatedUser);
    localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
    toast.success(`Earned new badge: ${badgeInfo.name}!`);
  };

  const subscribeToArea = (area: Omit<SubscribedArea, 'id'>) => {
    if (!user) return;
    
    const newArea: SubscribedArea = {
      id: `area-${Date.now()}`,
      ...area
    };
    
    const updatedUser = {
      ...user,
      subscribedAreas: [...(user.subscribedAreas || []), newArea]
    };
    
    setUser(updatedUser);
    localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
    toast.success(`Subscribed to alerts in ${area.name}`);
  };

  const unsubscribeFromArea = (areaId: string) => {
    if (!user || !user.subscribedAreas) return;
    
    const updatedUser = {
      ...user,
      subscribedAreas: user.subscribedAreas.filter(area => area.id !== areaId)
    };
    
    setUser(updatedUser);
    localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
    toast.success(`Unsubscribed from area alerts`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.isAdmin || false,
        isLoading,
        login,
        register,
        logout,
        continueAsGuest,
        addPoints,
        awardBadge,
        subscribeToArea,
        unsubscribeFromArea
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
