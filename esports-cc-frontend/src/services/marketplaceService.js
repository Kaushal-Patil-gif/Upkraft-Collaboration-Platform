const API_BASE = 'http://localhost:5011/api';

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
