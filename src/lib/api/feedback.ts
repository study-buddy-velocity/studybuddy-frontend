const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type FeedbackStatus = 'pending' | 'completed' | 'rejected' | 'open' | 'in-progress' | 'resolved' | 'closed';

export interface Feedback {
  _id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  status: FeedbackStatus;
  adminResponse?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  subject?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackData {
  title: string;
  description: string;
  priority?: string;
  category?: string;
  subject?: string;
  attachments?: string[];
}

export interface UpdateFeedbackStatusData {
  status: FeedbackStatus;
  adminResponse?: string;
}

export interface FeedbackFilter {
  status?: FeedbackStatus;
  userId?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// User feedback API functions
export const feedbackApi = {
  // User endpoints
  create: async (data: CreateFeedbackData): Promise<Feedback> => {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to create feedback');
    }
    return response.json();
  },

  getUserFeedbacks: async (): Promise<Feedback[]> => {
    const response = await fetch(`${API_BASE_URL}/feedback/my-feedbacks`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user feedbacks');
    }
    return response.json();
  },

  getUserFeedbackById: async (id: string): Promise<Feedback> => {
    const response = await fetch(`${API_BASE_URL}/feedback/my-feedbacks/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }
    return response.json();
  },

  // Admin endpoints
  getAllFeedbacks: async (filter?: FeedbackFilter): Promise<Feedback[]> => {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.userId) params.append('userId', filter.userId);

    const url = `${API_BASE_URL}/feedback/admin${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch feedbacks');
    }
    return response.json();
  },

  getFeedbackById: async (id: string): Promise<Feedback> => {
    const response = await fetch(`${API_BASE_URL}/feedback/admin/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }
    return response.json();
  },

  updateStatus: async (id: string, data: UpdateFeedbackStatusData): Promise<Feedback> => {
    const response = await fetch(`${API_BASE_URL}/feedback/admin/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update feedback status');
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/feedback/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete feedback');
    }
  }
};
