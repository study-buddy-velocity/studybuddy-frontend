const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
import { handleAuthRedirect } from '@/lib/handleAuthRedirect';

export interface Subject {
  _id: string;
  name: string;
  description?: string;
  topics: Topic[];
}

export interface Topic {
  _id: string;
  name: string;
  description?: string;
  classId?: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  _id: string;
  question: string;
  options: QuizOption[];
  subjectId: string;
  topicId: string;
  type?: string;
  difficulty?: number;
  explanation?: string;
  classId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizData {
  question: string;
  options: QuizOption[];
  subjectId: string;
  topicId: string;
  type?: string;
  difficulty?: number;
  explanation?: string;
  classId?: string;
}

export interface UpdateQuizData {
  question?: string;
  options?: QuizOption[];
  type?: string;
  difficulty?: number;
  explanation?: string;
  classId?: string;
}

export interface QuizFilter {
  subjectId?: string;
  topicId?: string;
  classId?: string;
  noOfQuestions?: number;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Subject API functions
export const subjectApi = {
  getAll: async (): Promise<Subject[]> => {
    // Try user endpoint first (filters topics by user class), then fallback to admin for full data
    try {
      const userResponse = await fetch(`${API_BASE_URL}/users/subjects`, {
        headers: getAuthHeaders()
      });
      if (userResponse.ok) {
        return userResponse.json();
      }
    } catch (e) {
      console.warn('User subjects endpoint not available, trying admin subjects');
    }

    const adminResponse = await fetch(`${API_BASE_URL}/admin/subjects`, {
      headers: getAuthHeaders()
    });
    if (!adminResponse.ok) {
      throw new Error('Failed to fetch subjects');
    }
    return adminResponse.json();
  },

  getById: async (id: string): Promise<Subject> => {
    try {
      const userResponse = await fetch(`${API_BASE_URL}/users/subjects/${id}`, {
        headers: getAuthHeaders()
      });
      if (userResponse.ok) {
        return userResponse.json();
      }
    } catch {}

    const adminResponse = await fetch(`${API_BASE_URL}/admin/subjects/${id}`, {
      headers: getAuthHeaders()
    });
    if (!adminResponse.ok) {
      throw new Error('Failed to fetch subject');
    }
    return adminResponse.json();
  }
};

// Quiz API functions
export const quizApi = {
  getAll: async (filter?: QuizFilter): Promise<Quiz[]> => {
    const params = new URLSearchParams();
    if (filter?.subjectId) params.append('subjectId', filter.subjectId);
    if (filter?.topicId) params.append('topicId', filter.topicId);
    if (filter?.classId) params.append('classId', filter.classId);
    if (filter?.noOfQuestions) params.append('noOfQuestions', filter.noOfQuestions.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';

    // Try user-facing endpoint first
    try {
      const userUrl = `${API_BASE_URL}/users/quizzes${queryString}`;
      const userResponse = await fetch(userUrl, {
        headers: getAuthHeaders(),
        cache: 'no-store'
      });

      if (userResponse.status === 401 || userResponse.status === 403) {
        // Handle auth redirect
        if (typeof window !== 'undefined') {
          try { localStorage.clear(); } catch {}
          try { sessionStorage.clear(); } catch {}
          window.location.href = '/intro'
        }
      }

      if (userResponse.ok) {
        return userResponse.json();
      }
    } catch (error) {
      console.error('User quiz endpoint not available, trying admin endpoint', error);
      //console.log('User quiz endpoint not available, trying admin endpoint');
    }

    // Fallback to admin endpoint
    try {
      const adminUrl = `${API_BASE_URL}/admin/quizzes${queryString}`;
      const adminResponse = await fetch(adminUrl, {
        headers: getAuthHeaders(),
        cache: 'no-store'
      });

      if (adminResponse.status === 401 || adminResponse.status === 403) {
        if (typeof window !== 'undefined') {
          try { localStorage.clear(); } catch {}
          try { sessionStorage.clear(); } catch {}
          window.location.href = '/intro'
        }
      }

      if (adminResponse.ok) {
        return adminResponse.json();
      }
    } catch (error) {
      console.error('Admin quiz endpoint failed:', error);
    }

    throw new Error('Failed to fetch quizzes from both user and admin endpoints');
  },

  getById: async (id: string): Promise<Quiz> => {
    const response = await fetch(`${API_BASE_URL}/admin/quizzes/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }
    return response.json();
  },

  create: async (data: CreateQuizData): Promise<Quiz> => {
    const response = await fetch(`${API_BASE_URL}/admin/quizzes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
    return response.json();
  },

  update: async (id: string, data: UpdateQuizData): Promise<Quiz> => {
    const response = await fetch(`${API_BASE_URL}/admin/quizzes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update quiz');
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/quizzes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete quiz');
    }
  }
};
