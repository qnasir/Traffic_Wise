
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Award, FileText } from './DashboardIcons';
import { Button } from '@/components/ui/button';
import EmptyState from './EmptyState';
import { formatDistanceToNow } from 'date-fns';

interface AchievementsTabProps {
  user: any;
  navigate: NavigateFunction;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ user, navigate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          Your badges and points for contributing to TrafficWise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <h3 className="font-medium mb-2">Points</h3>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Award className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold">{user.points || 0}</p>
              <p className="text-sm text-gray-500">Total points earned</p>
              <Progress 
                value={((user.points || 0) % 100) || 0} 
                className="h-2 mt-2" 
              />
              <p className="text-xs text-gray-400 mt-1">
                {100 - ((user.points || 0) % 100)} points until next level
              </p>
            </div>
          </div>
        </div>
        
        <h3 className="font-medium mb-4">Badges</h3>
        {user.badges && user.badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.badges.map(badge => (
              <div key={badge.id} className="border rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-primary/10 text-primary p-3 rounded-full mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="font-medium">{badge.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Earned {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Award />}
            title="No badges yet"
            description="Contribute to TrafficWise to earn badges"
            buttonText="Report an Issue"
            onButtonClick={() => navigate('/#report-section')}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsTab;
