
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth, SubscribedArea } from './AuthContext';
import { useAlerts, Report, Location } from './AlertsContext';
import { Bell, BellOff } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  reportId?: string;
  createdAt: Date;
  read: boolean;
  type: 'alert' | 'badge' | 'system';
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  enablePushNotifications: () => Promise<boolean>;
  disablePushNotifications: () => void;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  toggleEmailNotifications: () => void;
  hasPermission: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

// Calculate distance between two points using the Haversine formula
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

// Check if a report is within any of the user's subscribed areas
const isReportInSubscribedArea = (report: Report, subscribedAreas: SubscribedArea[] = []) => {
  if (!subscribedAreas || subscribedAreas.length === 0) return false;
  
  return subscribedAreas.some(area => {
    const distance = getDistanceFromLatLonInKm(
      area.location.lat,
      area.location.lng,
      report.location.lat,
      report.location.lng
    );
    return distance <= area.radius;
  });
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useAuth();
  const { reports } = useAlerts();
  
  // Load saved notifications from localStorage
  useEffect(() => {
    if (user) {
      // Load notifications
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        try {
          const parsedNotifications = JSON.parse(savedNotifications);
          setNotifications(parsedNotifications);
        } catch (error) {
          console.error('Error parsing saved notifications:', error);
        }
      }
      
      // Load notification settings
      const notificationSettings = localStorage.getItem(`notification_settings_${user.id}`);
      if (notificationSettings) {
        try {
          const parsedSettings = JSON.parse(notificationSettings);
          setPushNotificationsEnabled(parsedSettings.push);
          setEmailNotificationsEnabled(parsedSettings.email);
          setHasPermission(parsedSettings.hasPermission);
        } catch (error) {
          console.error('Error parsing notification settings:', error);
        }
      }
    }
  }, [user]);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);
  
  // Save notification settings to localStorage when they change
  useEffect(() => {
    if (user) {
      const settings = {
        push: pushNotificationsEnabled,
        email: emailNotificationsEnabled,
        hasPermission,
      };
      localStorage.setItem(`notification_settings_${user.id}`, JSON.stringify(settings));
    }
  }, [pushNotificationsEnabled, emailNotificationsEnabled, hasPermission, user]);
  
  // Check for new reports that match user's subscribed areas
  useEffect(() => {
    if (!user || !user.subscribedAreas || user.subscribedAreas.length === 0) return;
    
    // Get last known report timestamp
    const lastNotificationTime = localStorage.getItem(`last_notification_time_${user.id}`);
    const lastTime = lastNotificationTime ? new Date(JSON.parse(lastNotificationTime)) : new Date(0);
    
    // Check for new reports since last check
    const newReports = reports.filter(report => {
      const reportTime = new Date(report.reportedAt);
      return reportTime > lastTime && isReportInSubscribedArea(report, user.subscribedAreas);
    });
    
    if (newReports.length > 0) {
      // Create notifications for new reports in subscribed areas
      const newNotifications = newReports.map(report => ({
        id: `notification-${Date.now()}-${report.id}`,
        title: 'New Alert in Your Area',
        message: `${report.title} - ${report.location.address || 'Unknown location'}`,
        reportId: report.id,
        createdAt: new Date(),
        read: false,
        type: 'alert' as const,
      }));
      
      setNotifications(prev => [...newNotifications, ...prev]);
      
      // Show toast for new notifications if push enabled
      if (pushNotificationsEnabled && newNotifications.length > 0) {
        toast.success(`${newNotifications.length} new alert${newNotifications.length > 1 ? 's' : ''} in your subscribed areas`, {
          icon: <Bell className="h-4 w-4" />,
        });
      }
      
      // Update last notification time
      localStorage.setItem(`last_notification_time_${user.id}`, JSON.stringify(new Date()));
    }
  }, [reports, user]);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const enablePushNotifications = async () => {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      toast.error('This browser does not support push notifications');
      return false;
    }
    
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setPushNotificationsEnabled(true);
        setHasPermission(true);
        toast.success('Push notifications enabled');
        return true;
      } else {
        toast.error('Permission for push notifications was denied');
        setPushNotificationsEnabled(false);
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Error enabling push notifications');
      return false;
    }
  };
  
  const disablePushNotifications = () => {
    setPushNotificationsEnabled(false);
    toast.success('Push notifications disabled');
  };
  
  const toggleEmailNotifications = () => {
    setEmailNotificationsEnabled(prev => !prev);
    toast.success(emailNotificationsEnabled ? 'Email notifications disabled' : 'Email notifications enabled');
  };
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        enablePushNotifications,
        disablePushNotifications,
        pushNotificationsEnabled,
        emailNotificationsEnabled,
        toggleEmailNotifications,
        hasPermission,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
