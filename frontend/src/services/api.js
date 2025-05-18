const API_URL = 'http://localhost:3000';

// Helper function for API requests
async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// User API calls
export const userApi = {
  getAll: () => fetchApi('/users'),
  getById: (id) => fetchApi(`/users/${id}`),
  create: (userData) => fetchApi('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  update: (id, userData) => fetchApi(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  delete: (id) => fetchApi(`/users/${id}`, {
    method: 'DELETE'
  }),
  getNotifications: (id) => fetchApi(`/users/${id}/notifications`)
};

// Notification API calls
export const notificationApi = {
  send: (notificationData) => fetchApi('/notifications', {
    method: 'POST',
    body: JSON.stringify(notificationData)
  })
};
