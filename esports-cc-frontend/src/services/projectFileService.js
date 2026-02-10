const API_BASE = 'http://localhost:5011/api';

export const uploadProjectFile = async (projectId, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      console.log('XHR Load event - Status:', xhr.status);
      console.log('XHR Response:', xhr.responseText);
      
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.log('Parsed response:', response);
          resolve(response);
        } catch (e) {
          console.error('JSON parse error:', e);
          reject(new Error('Invalid response format: ' + xhr.responseText));
        }
      } else {
        console.error('Upload failed with status:', xhr.status, xhr.responseText);
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      console.log('XHR Error occurred');
      reject(new Error('Network error during upload'));
    });
    
    xhr.addEventListener('timeout', () => {
      console.log('XHR Timeout occurred');
      reject(new Error('Upload timeout'));
    });
    
    console.log('Starting XHR upload...');
    const token = localStorage.getItem('token');
    xhr.open('POST', `${API_BASE}/projects/${projectId}/files/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.timeout = 300000; // 5 minute 
    xhr.send(formData);
  });
};

export const getProjectFiles = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/projects/${projectId}/files`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to get project files');
    return await response.json();
  } catch (error) {
    console.error('Get project files error:', error);
    throw error;
  }
};