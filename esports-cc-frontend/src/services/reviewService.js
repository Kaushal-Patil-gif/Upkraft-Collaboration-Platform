const API_BASE = 'http://localhost:5011/api';

export const getServiceReviews = async (serviceId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reviews/service/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  } catch (error) {
    console.error('Get reviews error:', error);
    throw error;
  }
};

export const addReview = async (projectId, reviewData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reviews/project/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    
    if (!response.ok) throw new Error('Failed to add review');
    return await response.json();
  } catch (error) {
    console.error('Add review error:', error);
    throw error;
  }
};

export const checkProjectReviewed = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reviews/project/${projectId}/check`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to check review status');
    const result = await response.json();
    return result.hasReviewed || false;
  } catch (error) {
    console.error('Check review status error:', error);
    return false;
  }
};