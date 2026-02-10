const API_BASE_URL = 'http://localhost:5011/api';

export const getPaymentHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/payments/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch payment history');
  return response.json();
};

export const generateInvoice = async (projectId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/payments/invoice/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to generate invoice');
  return response.json();
};

export const releaseMilestonePayment = async (projectId, milestoneIndex, amount) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/payments/milestone/${projectId}/release`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      milestoneIndex, 
      amount,
      milestoneTitle: `Milestone ${milestoneIndex + 1}`
    })
  });
  if (!response.ok) throw new Error('Failed to release milestone payment');
  return response.json();
};

export const getMilestonePayments = async (projectId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/payments/milestones/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to get milestone payments');
  return response.json();
};