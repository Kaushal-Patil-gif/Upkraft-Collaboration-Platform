const API_BASE = 'http://localhost:5011/api';

export const getAllProjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/projects/my-projects`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Get all projects error:', error);
    throw error;
  }
};