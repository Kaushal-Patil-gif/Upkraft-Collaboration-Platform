const API_BASE = 'http://localhost:5011/api';

export const getKycStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/kyc/status`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get KYC status: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('KYC status error:', error);
    throw error;
  }
};