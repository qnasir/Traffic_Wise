
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from './DashboardIcons';
import ReportCard from './ReportCard';
import EmptyState from './EmptyState';

interface ReportsTabProps {
  userReports: any[];
  navigate: NavigateFunction;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ userReports, navigate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reports</CardTitle>
        <CardDescription>
          All road issues you've reported
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userReports.length > 0 ? (
          <div className="space-y-4">
            {userReports.map(report => (
              <ReportCard key={report.id} report={report} />
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
  );
};

export default ReportsTab;
