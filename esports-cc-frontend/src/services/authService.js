const API_BASE = 'http://localhost:5011/api';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'Login failed');
      error.response = { data: errorData };
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'Registration failed');
      error.response = { data: errorData };
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const googleAuth = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const text = await response.text();
      let errorMessage = 'Google authentication failed';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || 'Google authentication failed';
      } catch (parseError) {
        errorMessage = text || 'Google authentication failed';
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch(`${API_BASE}/auth/update-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update role');
    }
    return await response.json();
  } catch (error) {
    console.error('Update role error:', error);
    throw error;
  }
};
