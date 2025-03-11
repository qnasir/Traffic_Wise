
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Bell } from './DashboardIcons';
import {User} from '../../context/AuthContext'

interface DashboardHeaderProps {
  user: User | null;
  onShowProfile: () => void;
  onShowAreaDialog: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  user, 
  onShowProfile, 
  onShowAreaDialog 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your reports, subscriptions, and achievements
        </p>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0 space-x-3">
        <Button onClick={onShowProfile} variant="outline" size="sm">
          <UserIcon className="h-4 w-4 mr-2" />
          Profile
        </Button>
        <Button onClick={onShowAreaDialog} variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Manage Alerts
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
