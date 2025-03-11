
import React, { useState } from 'react';
import { useNotifications } from '@/context/NotificationsContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellOff, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Mail, 
  Award,
  Info,
  MapPin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const { 
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
  } = useNotifications();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  
  const handleReadAll = () => {
    markAllAsRead();
  };
  
  const handleClearAll = () => {
    clearAllNotifications();
  };
  
  const getNotificationIcon = (type: 'alert' | 'badge' | 'system') => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-alert-high" />;
      case 'badge':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'system':
        return <Info className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`relative p-2 ${className}`}
          onClick={() => setOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              title="Mark all as read"
              onClick={handleReadAll}
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive" 
              title="Clear all"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-1 px-1 py-0 text-[10px]">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 flex gap-3 hover:bg-muted transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts in your browser
                  </p>
                </div>
                <Switch
                  checked={pushNotificationsEnabled}
                  onCheckedChange={async (checked) => {
                    if (checked) {
                      await enablePushNotifications();
                    } else {
                      disablePushNotifications();
                    }
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts in your email
                  </p>
                </div>
                <Switch
                  checked={emailNotificationsEnabled}
                  onCheckedChange={toggleEmailNotifications}
                />
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Subscribed Areas
                </h4>
                {user.subscribedAreas && user.subscribedAreas.length > 0 ? (
                  <div className="space-y-2">
                    {user.subscribedAreas.map((area) => (
                      <div key={area.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div>
                          <p className="text-sm font-medium">{area.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {area.radius} km radius
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You haven't subscribed to any areas yet.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
