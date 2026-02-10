const API_BASE = 'http://localhost:5011/api';

export const getPendingKyc = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/kyc/pending`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get pending KYC: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get pending KYC error:', error);
    throw error;
  }
};

export const getAdminStats = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get admin stats: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get admin stats error:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get users: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}/deactivate`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to deactivate user: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Deactivate user error:', error);
    throw error;
  }
};

export const activateUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}/activate`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to activate user: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Activate user error:', error);
    throw error;
  }
};

export const reviewKyc = async (userId, action, remarks = "") => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/kyc/review`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, action, remarks })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to ${action} KYC: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`${action} KYC error:`, error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 400 && errorData.data) {
        const error = new Error('Validation failed');
        error.validationErrors = errorData.data;
        throw error;
      }
      throw new Error(errorData.message || `Update failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};