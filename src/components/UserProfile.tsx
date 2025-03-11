
import React from 'react';
import { useAuth, Badge as UserBadge } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, User, Star, MapPin, Activity } from 'lucide-react';

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  // Calculate the next point milestone
  const getNextMilestone = () => {
    const points = user.points || 0;
    if (points < 50) return { target: 50, progress: (points / 50) * 100 };
    if (points < 100) return { target: 100, progress: ((points - 50) / 50) * 100 };
    if (points < 250) return { target: 250, progress: ((points - 100) / 150) * 100 };
    if (points < 500) return { target: 500, progress: ((points - 250) / 250) * 100 };
    return { target: points + 500, progress: 100 };
  };
  
  const nextMilestone = getNextMilestone();
  
  // Get badge icon
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'flag':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>;
      case 'shield':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
      case 'help-circle':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
      case 'check-circle':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
      default:
        return <Award className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Your Profile</CardTitle>
            <CardDescription>Track your contributions and rewards</CardDescription>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="badges">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="badges" className="flex gap-1 items-center">
              <Award className="h-4 w-4" />
              <span>Badges</span>
            </TabsTrigger>
            <TabsTrigger value="points" className="flex gap-1 items-center">
              <Star className="h-4 w-4" />
              <span>Points</span>
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex gap-1 items-center">
              <MapPin className="h-4 w-4" />
              <span>Areas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="pt-4">
            {user.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {user.badges.map((badge: UserBadge) => (
                  <div 
                    key={badge.id} 
                    className="p-3 border rounded-lg flex gap-2 items-center"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium">No badges yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Start contributing to earn badges
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="points" className="pt-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-2">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">{user.points || 0}</h3>
              <p className="text-sm text-muted-foreground">Total points earned</p>
            </div>
            
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span>Next milestone: {nextMilestone.target} points</span>
                <span>{user.points || 0} / {nextMilestone.target}</span>
              </div>
              <Progress value={nextMilestone.progress} className="h-2" />
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                How to earn points
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Submit a report: +10 points</li>
                <li>• Report gets verified: +5 points</li>
                <li>• Upvote a report: +1 point</li>
                <li>• Your report helps someone: +2 points</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="areas" className="pt-4">
            {user.subscribedAreas && user.subscribedAreas.length > 0 ? (
              <div className="space-y-3">
                {user.subscribedAreas.map((area) => (
                  <div key={area.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{area.name}</h4>
                      <Badge variant="outline">{area.radius} km</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lat: {area.location.lat.toFixed(4)}, Lng: {area.location.lng.toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium">No subscribed areas</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Subscribe to areas to receive alerts
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
