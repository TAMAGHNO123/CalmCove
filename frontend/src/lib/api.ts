const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch wrapper with authentication
 * Token should be obtained from useAuth() hook in client components
 */
async function authenticatedFetch(url: string, token: string | null, options: RequestInit = {}) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
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
