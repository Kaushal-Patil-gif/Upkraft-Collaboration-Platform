const API_BASE = 'http://localhost:5011/api';

export const getCreatorDashboard = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE}/dashboard/creator`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) throw new Error('Failed to get creator dashboard');
    return await response.json();
  } catch (error) {
    console.error('Creator dashboard error:', error);
    throw error;
  }
};

export const getFreelancerDashboard = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/dashboard/freelancer`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to get freelancer dashboard');
    return await response.json();
  } catch (error) {
    console.error('Freelancer dashboard error:', error);
    throw error;
  }
};

export const getServices = async () => {
  try {
    const response = await fetch(`${API_BASE}/services`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error('Failed to get services');
    return await response.json();
  } catch (error) {
    console.error('Services error:', error);
    throw error;
  }
};