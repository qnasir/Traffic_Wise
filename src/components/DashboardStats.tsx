
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  progress?: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  progress, 
  icon 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-3" />
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalReports,
  resolvedReports,
  pendingReports,
  inProgressReports
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Reports"
        value={totalReports}
        description="All submitted reports"
        progress={100}
        icon={<Activity className="h-4 w-4 text-gray-500" />}
      />
      
      <StatsCard
        title="Resolved"
        value={resolvedReports}
        description={`${Math.round((resolvedReports / totalReports) * 100)}% completion rate`}
        progress={totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
      />
      
      <StatsCard
        title="In Progress"
        value={inProgressReports}
        description={`${Math.round((inProgressReports / totalReports) * 100)}% of all reports`}
        progress={totalReports > 0 ? (inProgressReports / totalReports) * 100 : 0}
        icon={<Clock className="h-4 w-4 text-amber-500" />}
      />
      
      <StatsCard
        title="Pending"
        value={pendingReports}
        description={`${Math.round((pendingReports / totalReports) * 100)}% require attention`}
        progress={totalReports > 0 ? (pendingReports / totalReports) * 100 : 0}
        icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
      />
    </div>
  );
};

export default DashboardStats;
