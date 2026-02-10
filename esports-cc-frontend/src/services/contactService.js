const API_BASE = 'http://localhost:5011/api';

export const sendContactMessage = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to send message';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('Contact form error:', error);
    throw error;
  }
};