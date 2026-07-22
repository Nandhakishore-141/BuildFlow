import { create } from 'zustand';

// Helper to get initial state from localStorage
const getLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
};

export const useAuthStore = create((set, get) => ({
  user: getLocalStorage('buildflow_current_user', null),
  users: getLocalStorage('buildflow_users', []),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = get().users;
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // Remove password for security in active session
      const { password: _, ...sessionUser } = foundUser;
      set({ user: sessionUser, isLoading: false, error: null });
      setLocalStorage('buildflow_current_user', sessionUser);
      return { success: true };
    } else {
      const defaultMatch = email.toLowerCase() === 'admin@buildflow.io' && password === 'Password123';
      if (defaultMatch) {
        const adminUser = {
          name: 'Anand Mehta',
          email: 'admin@buildflow.io',
          role: 'Contractor',
          companyName: 'Mehta & Co',
        };
        set({ user: adminUser, isLoading: false, error: null });
        setLocalStorage('buildflow_current_user', adminUser);
        return { success: true };
      }
      set({ isLoading: false, error: 'Invalid email or password' });
      return { success: false, error: 'Invalid email or password' };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = get().users;
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    ) || userData.email.toLowerCase() === 'admin@buildflow.io';

    if (emailExists) {
      set({ isLoading: false, error: 'Email address is already registered' });
      return { success: false, error: 'Email address is already registered' };
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    set({ users: updatedUsers, isLoading: false, error: null });
    setLocalStorage('buildflow_users', updatedUsers);

    // Auto-login after registration
    const { password: _, ...sessionUser } = newUser;
    set({ user: sessionUser });
    setLocalStorage('buildflow_current_user', sessionUser);

    return { success: true };
  },

  logout: () => {
    set({ user: null, error: null });
    localStorage.removeItem('buildflow_current_user');
  },

  resetPassword: async (email, newPassword) => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = get().users;
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        password: newPassword,
      };
      set({ users: updatedUsers, isLoading: false });
      setLocalStorage('buildflow_users', updatedUsers);
      return { success: true };
    }

    // Default admin mock reset
    if (email.toLowerCase() === 'admin@buildflow.io') {
      set({ isLoading: false });
      return { success: true };
    }

    set({ isLoading: false, error: 'Email not found' });
    return { success: false, error: 'Email not found' };
  },

  clearError: () => set({ error: null }),
}));
