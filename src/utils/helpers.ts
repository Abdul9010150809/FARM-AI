export const showNotification = (message: string, type = 'info') => {
  // Create or get toast element
  let toast = document.getElementById('notificationToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'notificationToast';
    toast.className = `toast notification-toast ${type}`;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1050; display: none;';
    
    const toastMessage = document.createElement('div');
    toastMessage.id = 'toastMessage';
    toastMessage.className = 'toast-body';
    toast.appendChild(toastMessage);
    
    document.body.appendChild(toast);
  }
  
  const toastMessage = document.getElementById('toastMessage');
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
      if (toast) {
        toast.style.display = 'none';
      }
    }, 5000);
  }
};

export const getLanguageName = (code: string) => {
  const languages: Record<string, string> = {
    'en': 'English',
    'te': 'Telugu',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'kn': 'Kannada',
    'ml': 'Malayalam'
  };
  return languages[code] || code;
};

export const formatNumber = (num: number, decimals = 2) => {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const getCropImage = (cropType: string) => {
  const cropImages: Record<string, string> = {
    'rice': 'https://images.unsplash.com/photo-1563227815-4dd1652edb0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'wheat': 'https://images.unsplash.com/photo-1505842381624-c6b0579625a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'corn': 'https://images.unsplash.com/photo-1505842381624-c6b0579625a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'sugarcane': 'https://images.unsplash.com/photo-1611088139556-5d1c4a2b5c0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'cotton': 'https://images.unsplash.com/photo-1563227815-4dd1652edb0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'chillies': 'https://images.unsplash.com/photo-1612333973670-7402fd5d0a5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'turmeric': 'https://images.unsplash.com/photo-1611088139556-5d1c4a2b5c0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'pulses': 'https://images.unsplash.com/photo-1563227815-4dd1652edb0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  };
  
  return cropImages[cropType] || 'https://images.unsplash.com/photo-1563227815-4dd1652edb0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};