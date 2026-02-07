const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch wrapper with authentication
 * Token should be obtained from useAuth() hook in client components
 */
async function authenticatedFetch(url: string, token: string | null, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(`API Error (${response.status}):`, text);
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || `HTTP ${response.status}`);
        } catch (e) {
            throw new Error(`Request failed: ${response.status} - ${text.substring(0, 50)}...`);
        }
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// Appointment API
export const appointmentsApi = {
    /**
     * Get all appointments for the authenticated user
     * @param token - Clerk session token from useAuth().getToken()
     */
    async getAll(token: string | null) {
        return authenticatedFetch(`${API_BASE_URL}/appointments`, token);
    },

    /**
     * Create a new appointment
     * @param token - Clerk session token from useAuth().getToken()
     */
    async create(token: string | null, data: { doctorName: string; scheduledAt: string }) {
        return authenticatedFetch(`${API_BASE_URL}/appointments`, token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Cancel an appointment
     * @param token - Clerk session token from useAuth().getToken()
     */
    async cancel(token: string | null, id: string) {
        return authenticatedFetch(`${API_BASE_URL}/appointments/${id}`, token, {
            method: 'DELETE',
        });
    },
};

// Tips API
export const tipsApi = {
    /**
     * Get today's tip (public endpoint)
     */
    async getToday() {
        const response = await fetch(`${API_BASE_URL}/tips/today`);
        if (!response.ok) {
            throw new Error('Failed to fetch tip');
        }
        return response.json();
    },
};

// Quiz API
export const quizApi = {
    /**
     * Save quiz result
     */
    async saveResult(token: string | null, score: number) {
        return authenticatedFetch(`${API_BASE_URL}/quiz`, token, {
            method: 'POST',
            body: JSON.stringify({ score }),
        });
    },

    /**
     * Get latest quiz result
     */
    async getLatest(token: string | null) {
        return authenticatedFetch(`${API_BASE_URL}/quiz/latest`, token);
    }
};

// Resources API
export const resourcesApi = {
    /**
     * Get recommended resources based on latest quiz
     */
    async getRecommendations(token: string | null) {
        return authenticatedFetch(`${API_BASE_URL}/resources`, token);
    }
};

// Blog API
export const blogApi = {
    /**
     * Get AI-generated blog content for a topic
     */
    async getPost(token: string | null, category: string, topic: string) {
        return authenticatedFetch(`${API_BASE_URL}/blog/${encodeURIComponent(category)}/${encodeURIComponent(topic)}`, token);
    }
};
