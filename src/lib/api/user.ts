const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface UserDetails {
  _id: string;
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  school: string;
  class: string;
  subjects: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDetailsData {
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  school: string;
  class: string;
  subjects: string[];
  profileImage?: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  userDetails?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// User API functions
export const userApi = {
  // Get current user details
  getUserDetails: async (): Promise<UserDetails> => {
    const response = await fetch(`${API_BASE_URL}/users/user-details`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    return response.json();
  },

  // Create user details
  createUserDetails: async (data: CreateUserDetailsData): Promise<UserDetails> => {
    const response = await fetch(`${API_BASE_URL}/users/user-details`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to create user details');
    }
    return response.json();
  },

  // Update user details
  updateUserDetails: async (data: Partial<CreateUserDetailsData>): Promise<UserDetails> => {
    const response = await fetch(`${API_BASE_URL}/users/user-details`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update user details');
    }
    return response.json();
  },

  // Admin endpoints
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users?id=${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
};
