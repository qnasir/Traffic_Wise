
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MapPin } from './DashboardIcons';
import EmptyState from './EmptyState';
import {SubscribedArea} from '../../context/AuthContext'

interface SubscriptionsTabProps {
  subscribedAreas: SubscribedArea[];
  onShowAreaDialog: () => void;
}

const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({ 
  subscribedAreas, 
  onShowAreaDialog 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Area Subscriptions</CardTitle>
          <CardDescription>
            Manage your alert area subscriptions
          </CardDescription>
        </div>
        <Button size="sm" onClick={onShowAreaDialog}>
          <MapPin className="h-4 w-4 mr-2" />
          Add New Area
        </Button>
      </CardHeader>
      <CardContent>
        {subscribedAreas.length > 0 ? (
          <div className="space-y-4">
            {subscribedAreas.map(area => (
              <div key={area.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    {area.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {area.radius} km radius from coordinates: {area.location.lat.toFixed(4)}, {area.location.lng.toFixed(4)}
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="mt-3 md:mt-0"
                  onClick={() => {
                    const { unsubscribeFromArea } = useAuth();
                    unsubscribeFromArea(area.id);
                  }}
                >
                  Unsubscribe
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MapPin />}
            title="No area subscriptions"
            description="Subscribe to areas to receive alerts about new reports"
            buttonText="Subscribe to an Area"
            onButtonClick={onShowAreaDialog}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionsTab;
