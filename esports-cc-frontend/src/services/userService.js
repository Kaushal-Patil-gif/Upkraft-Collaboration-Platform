const API_BASE = 'http://localhost:5011/api';

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user profile: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('User profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    
    const backendData = {
      name: profileData.name,
      email: profileData.email,
      professionalName: profileData.professionalName,
      channelName: profileData.channelName,
      bio: profileData.bio,
      location: profileData.location,
      website: profileData.website,
      skills: profileData.skills
    };
    
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { message: await response.text() };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};