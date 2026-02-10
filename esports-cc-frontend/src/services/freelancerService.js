const API_BASE = 'http://localhost:5011/api';

export const createService = async (serviceData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/freelancer/services`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: serviceData
    });
    
    if (!response.ok) throw new Error('Failed to create service');
    return await response.json();
  } catch (error) {
    console.error('Service creation error:', error);
    throw error;
  }
};

export const updateService = async (serviceId, serviceData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Convert to FormData for multipart request
    const formData = new FormData();
    formData.append('title', serviceData.title);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price.toString());
    formData.append('deliveryTime', serviceData.deliveryTime.toString());
    formData.append('category', serviceData.category);
    formData.append('active', serviceData.active.toString());
    
    const response = await fetch(`${API_BASE}/freelancer/services/${serviceId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to update service');
    return await response.json();
  } catch (error) {
    console.error('Service update error:', error);
    throw error;
  }
};

export const getFreelancerServices = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/freelancer/services`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to get services');
    return await response.json();
  } catch (error) {
    console.error('Get services error:', error);
    throw error;
  }
};

export const deleteService = async (serviceId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/freelancer/services/${serviceId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to delete service');
    return await response.json();
  } catch (error) {
    console.error('Service deletion error:', error);
    throw error;
  }
};