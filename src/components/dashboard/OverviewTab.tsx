
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Award, Bell, FileText, MapPin } from './DashboardIcons';
import StatCard from './StatCard';
import ReportCard from './ReportCard';
import EmptyState from './EmptyState';
import {User} from '../../context/AuthContext'
import {Report} from '../../context/AlertsContext'


interface OverviewTabProps {
  user: User | null;
  userReports: Report[];
  areaReports: Report[];
  onShowAreaDialog: () => void;
  navigate: NavigateFunction;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  user,
  userReports,
  areaReports,
  onShowAreaDialog,
  navigate
}) => {
  // Stats for overview
  const totalReports = userReports.length;
  const resolvedReports = userReports.filter(report => report.resolved).length;
  const pendingReports = userReports.filter(report => !report.resolved).length;
  const subscriptionCount = user.subscribedAreas?.length || 0;
  const badgeCount = user.badges?.length || 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports"
          value={totalReports}
          subtitle="Reports you've submitted"
          progress={(totalReports / 10) * 100}
        />
        
        <StatCard
          title="Resolved Reports"
          value={resolvedReports}
          subtitle={`${pendingReports} pending reports`}
          progress={totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0}
        />
        
        <StatCard
          title="Area Subscriptions"
          value={subscriptionCount}
          subtitle="Active alert areas"
          button={{
            label: "Manage Subscriptions",
            icon: <Bell className="h-3 w-3 mr-2" />,
            onClick: onShowAreaDialog
          }}
        />
        
        <StatCard
          title="Achievements"
          value={badgeCount}
          subtitle="Badges earned"
          button={{
            label: "View Badges",
            icon: <Award className="h-3 w-3 mr-2" />,
            onClick: () => navigate('/badges')
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Your recently submitted reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userReports.length > 0 ? (
              <div className="space-y-4">
                {userReports.slice(0, 5).map(report => (
                  <ReportCard key={report.id} report={report} compact={true} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FileText />}
                title="No reports yet"
                description="You haven't submitted any road issue reports yet"
                buttonText="Report an Issue"
                onButtonClick={() => navigate('/#report-section')}
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Area Alerts</CardTitle>
            <CardDescription>
              Recent reports from your subscribed areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {areaReports.length > 0 ? (
              <div className="space-y-4">
                {areaReports.slice(0, 5).map(report => (
                  <div key={report.id} className="flex items-start space-x-4 border-b pb-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{report.title}</p>
                      <p className="text-xs text-gray-400">
                        {report.location.address || 'Unknown location'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MapPin />}
                title="No area alerts"
                description={user.subscribedAreas && user.subscribedAreas.length > 0
                  ? "No reports in your subscribed areas yet"
                  : "Subscribe to areas to get alerts"}
                buttonText="Subscribe to Areas"
                onButtonClick={onShowAreaDialog}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OverviewTab;
