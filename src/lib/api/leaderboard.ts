const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LeaderboardUser {
  userId: string;
  name: string;
  studentId: string;
  profileImage?: string;
  sparkPoints: number;
  rank: number;
  class: string;
  subjects: string[];
  totalQueries: number;
  streak: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  currentUser?: LeaderboardUser;
  totalUsers: number;
  period: string;
  filters: {
    subject?: string;
    class?: string;
  };
}

export interface TopPerformersResponse {
  topThree: LeaderboardUser[];
  currentUser?: LeaderboardUser;
}

export interface LeaderboardFilters {
  period?: 'weekly' | 'monthly' | 'all';
  subject?: string;
  class?: string;
  limit?: number;
}

export class LeaderboardAPI {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private static buildQueryParams(filters: LeaderboardFilters): string {
    const params = new URLSearchParams();
    
    if (filters.period) params.append('period', filters.period);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.class) params.append('class', filters.class);
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    return params.toString();
  }

  static async getLeaderboard(filters: LeaderboardFilters = {}): Promise<LeaderboardResponse> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/leaderboard${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return response.json();
  }

  static async getUserRank(filters: Omit<LeaderboardFilters, 'limit'> = {}): Promise<LeaderboardUser | null> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/leaderboard/user-rank${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user rank: ${response.statusText}`);
    }

    return response.json();
  }

  static async searchUsers(
    searchQuery: string, 
    filters: Omit<LeaderboardFilters, 'limit'> = {}
  ): Promise<LeaderboardResponse> {
    const params = new URLSearchParams({ query: searchQuery });
    
    if (filters.period) params.append('period', filters.period);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.class) params.append('class', filters.class);
    
    const url = `${API_BASE_URL}/leaderboard/search?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to search users: ${response.statusText}`);
    }

    return response.json();
  }

  static async getTopPerformers(filters: Omit<LeaderboardFilters, 'limit'> = {}): Promise<TopPerformersResponse> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/leaderboard/top-performers${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top performers: ${response.statusText}`);
    }

    return response.json();
  }
}

// Helper functions for formatting
export const formatSparkPoints = (points: number): string => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
};

export const getPositionSuffix = (position: number): string => {
  const lastDigit = position % 10;
  const lastTwoDigits = position % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }
  
  switch (lastDigit) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const getPositionColor = (position: number): string => {
  switch (position) {
    case 1: return 'bg-yellow-500';
    case 2: return 'bg-blue-500';
    case 3: return 'bg-orange-500';
    default: return 'bg-gray-400';
  }
};

// API functions to fetch subjects and classes from backend
export class SubjectClassAPI {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private static hasValidToken(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token && token.trim() !== '';
  }

  static async getSubjects(): Promise<string[]> {
    // Check if user is authenticated
    if (!this.hasValidToken()) {
      return [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'English',
        'Computer Science',
        'Economics',
        'History',
        'Geography',
        'Political Science'
      ];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/subjects`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.statusText}`);
      }

      const subjects = await response.json();
      return subjects.map((subject: { name: string }) => subject.name);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      // Fallback to default subjects
      return [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'English',
        'Computer Science',
        'Economics',
        'History',
        'Geography',
        'Political Science'
      ];
    }
  }

  static getClasses(): string[] {
    // Classes are predefined (6th-12th standard) as per backend implementation
    return [
      '6th Standard',
      '7th Standard',
      '8th Standard',
      '9th Standard',
      '10th Standard',
      '11th Standard',
      '12th Standard'
    ];
  }
}

// Legacy exports for backward compatibility (will be replaced with API calls)
export const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Computer Science',
  'Economics',
  'History',
  'Geography',
  'Political Science'
];

export const CLASS_OPTIONS = [
  '6th Standard',
  '7th Standard',
  '8th Standard',
  '9th Standard',
  '10th Standard',
  '11th Standard',
  '12th Standard'
];
