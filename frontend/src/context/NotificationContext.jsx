import React, { createContext, useState, useContext } from 'react';

// Create context
const NotificationContext = createContext();

// Provider component
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a notification
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    updateUnreadCount();
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    updateUnreadCount();
  };

  // Update unread count
  const updateUnreadCount = () => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  // Value object to be provided to consumers
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    addNotification,
    markAsRead,
    setLoading,
    setError
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use the notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
