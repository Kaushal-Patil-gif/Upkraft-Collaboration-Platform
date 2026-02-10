const API_BASE = 'http://localhost:5011/api';

export const holdEscrow = async (projectId, razorpayPaymentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/wallet/escrow/hold`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectId, razorpayPaymentId })
    });
    
    if (!response.ok) throw new Error('Failed to hold escrow');
    return await response.json();
  } catch (error) {
    console.error('Hold escrow error:', error);
    throw error;
  }
};

export const releaseEscrow = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/wallet/escrow/release/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to release escrow');
    return await response.json();
  } catch (error) {
    console.error('Release escrow error:', error);
    throw error;
  }
};

export const getWalletBalance = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/wallet/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to get wallet balance');
    return await response.json();
  } catch (error) {
    console.error('Get wallet balance error:', error);
    throw error;
  }
};

export const requestWithdrawal = async (withdrawalData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/wallet/withdraw/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(withdrawalData)
    });
    
    if (!response.ok) throw new Error('Failed to request withdrawal');
    return await response.json();
  } catch (error) {
    console.error('Withdrawal request error:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/wallet/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to get transactions');
    return await response.json();
  } catch (error) {
    console.error('Get transactions error:', error);
    throw error;
  }
};