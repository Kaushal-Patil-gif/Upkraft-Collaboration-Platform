const API_BASE = 'http://localhost:5011/api';

export const createProject = async (projectData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        serviceId: projectData.serviceId,
        title: projectData.title,
        description: projectData.description,
        deadline: projectData.deadline,
        milestones: projectData.milestones
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      error.response = { data: errorData };
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Project creation error:', error);
    throw error;
  }
};

export const getProject = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Get project error:', error);
    throw error;
  }
};

export const updateMilestoneStatus = async (projectId, milestoneIndex, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/projects/${projectId}/milestones`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        milestoneIndex,
        status
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Update milestone error:', error);
    throw error;
  }
};
