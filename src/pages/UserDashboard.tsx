
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAlerts } from '@/context/AlertsContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AreaSubscription from '@/components/AreaSubscription';
import UserProfile from '@/components/UserProfile';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OverviewTab from '@/components/dashboard/OverviewTab';
import ReportsTab from '@/components/dashboard/ReportsTab';
import SubscriptionsTab from '@/components/dashboard/SubscriptionsTab';
import AchievementsTab from '@/components/dashboard/AchievementsTab';
import { Activity, FileText, MapPin, Award } from '@/components/dashboard/DashboardIcons';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { reports } = useAlerts();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAreaDialog, setShowAreaDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  React.useEffect(() => {
    // Redirect non-authenticated users
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Will be redirected by useEffect
  }

  // Get user's reports
  const userReports = reports.filter(report => report.reportedBy === user.id);
  
  // Get reports for user's subscribed areas
  const areaReports = user.subscribedAreas && user.subscribedAreas.length > 0 
    ? reports.filter(report => {
        return user.subscribedAreas?.some(area => {
          // Calculate distance between report and subscription area center
          const latDiff = report.location.lat - area.location.lat;
          const lngDiff = report.location.lng - area.location.lng;
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
          return distance <= area.radius;
        });
      })
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <DashboardHeader 
            user={user} 
            onShowProfile={() => setShowProfileDialog(true)}
            onShowAreaDialog={() => setShowAreaDialog(true)}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity size={16} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText size={16} />
                <span>My Reports</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Area Subscriptions</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award size={16} />
                <span>Achievements</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab 
                user={user}
                userReports={userReports}
                areaReports={areaReports}
                onShowAreaDialog={() => setShowAreaDialog(true)}
                navigate={navigate}
              />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab 
                userReports={userReports}
                navigate={navigate}
              />
            </TabsContent>

            <TabsContent value="subscriptions">
              <SubscriptionsTab 
                subscribedAreas={user.subscribedAreas || []}
                onShowAreaDialog={() => setShowAreaDialog(true)}
              />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementsTab 
                user={user}
                navigate={navigate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AreaSubscription
        isOpen={showAreaDialog}
        onOpenChange={setShowAreaDialog}
      />
      
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <UserProfile />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default UserDashboard;
