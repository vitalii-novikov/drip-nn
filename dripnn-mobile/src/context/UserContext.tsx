import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const initialState: UserState = {
  user: null,
  isLoading: true,
  error: null,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...state, user: null, error: null };
    default:
      return state;
  }
};

interface UserContextType {
  state: UserState;
  login: (nickname: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  generateAnonymousUser: () => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'user_data';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Generate random user ID
  const generateUserId = (): number => {
    return Math.floor(Math.random() * 1000000) + 1;
  };

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        // Generate anonymous user if no stored user
        const anonymousUser = await generateAnonymousUser();
        dispatch({ type: 'SET_USER', payload: anonymousUser });
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
    }
  };

  const generateAnonymousUser = async (): Promise<User> => {
    const anonymousUser: User = {
      id: generateUserId(),
    };
    
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(anonymousUser));
      return anonymousUser;
    } catch (error) {
      console.error('Error saving anonymous user:', error);
      throw new Error('Failed to create anonymous user');
    }
  };

  const login = async (nickname: string, password?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const user: User = {
        id: generateUserId(),
        nickname,
        password,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Error during login:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to login' });
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to logout' });
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!state.user) return;

    try {
      const updatedUser = { ...state.user, ...updates };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update user' });
    }
  };

  const value: UserContextType = {
    state,
    login,
    logout,
    updateUser,
    generateAnonymousUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};