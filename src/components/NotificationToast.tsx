import React from 'react';

interface NotificationToastProps {
  message: string;
  type: string;
  visible: boolean;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, visible }) => {
  if (!visible) return null;

  return (
    <div className={`toast notification-toast ${type}`} style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1050,
      display: 'block'
    }}>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default NotificationToast;