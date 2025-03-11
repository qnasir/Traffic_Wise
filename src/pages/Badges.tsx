
import React, { useState } from 'react';
import { useAuth, Badge as UserBadge, BADGES } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Star, ShieldCheck, Trophy, Users, Flag, Flame } from 'lucide-react';

const Badges = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-badges');
  
  // Get badge icon
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'flag':
        return <Flag className="h-6 w-6" />;
      case 'shield':
        return <ShieldCheck className="h-6 w-6" />;
      case 'help-circle':
        return <Users className="h-6 w-6" />;
      case 'check-circle':
        return <Trophy className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };
  
  // Available badges including ones the user hasn't earned yet
  const availableBadges = [
    {
      ...BADGES.FIRST_REPORT,
      description: 'Submit your first road issue report',
      earned: user?.badges?.some(badge => badge.name === BADGES.FIRST_REPORT.name) || false
    },
    {
      ...BADGES.HELPER,
      description: 'Submit 5 road issue reports',
      earned: user?.badges?.some(badge => badge.name === BADGES.HELPER.name) || false
    },
    {
      ...BADGES.ROAD_GUARDIAN,
      description: 'Submit 10 road issue reports',
      earned: user?.badges?.some(badge => badge.name === BADGES.ROAD_GUARDIAN.name) || false
    },
    {
      ...BADGES.VERIFIER,
      description: 'Upvote or downvote 10 reports',
      earned: user?.badges?.some(badge => badge.name === BADGES.VERIFIER.name) || false
    },
    {
      name: 'Community Leader',
      description: 'Have 5 of your reports verified',
      icon: 'users',
      earned: false
    },
    {
      name: 'Road Expert',
      description: 'Submit reports of all types',
      icon: 'award',
      earned: false
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Achievements & Badges</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Earn badges and points by contributing to our community of road safety reporters. Help others and get recognized!
          </p>
        </div>
        
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Star className="h-5 w-5 mr-2 text-amber-500" />
                  Points
                </CardTitle>
                <CardDescription>Your contribution points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{user.points || 0}</div>
                  <p className="text-sm text-muted-foreground">Total points earned</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Badges
                </CardTitle>
                <CardDescription>Achievements unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{user.badges?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">
                    of {availableBadges.length} badges earned
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Flame className="h-5 w-5 mr-2 text-orange-500" />
                  Streak
                </CardTitle>
                <CardDescription>Consecutive active days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3</div>
                  <p className="text-sm text-muted-foreground">
                    days of activity
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-badges">My Badges</TabsTrigger>
            <TabsTrigger value="available-badges">Available Badges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-badges" className="pt-6">
            {user && user.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {user.badges.map((badge: UserBadge) => (
                  <Card key={badge.id} className="overflow-hidden">
                    <div className="h-2 bg-primary"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getBadgeIcon(badge.icon)}
                        </div>
                      </div>
                      <CardDescription>{badge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No badges yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Start reporting road issues, verifying reports, and helping the community to earn badges.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available-badges" className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {availableBadges.map((badge, index) => (
                <Card key={index} className={badge.earned ? "" : "opacity-75"}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        badge.earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {getBadgeIcon(badge.icon)}
                      </div>
                    </div>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={badge.earned ? "default" : "outline"} className="mt-2">
                      {badge.earned ? "Earned" : "Not earned yet"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Badges;
