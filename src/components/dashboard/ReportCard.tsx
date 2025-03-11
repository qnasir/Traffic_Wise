
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from './DashboardIcons';
import { getStatusIcon, statusColorMap } from './DashboardIcons';

interface ReportCardProps {
  report: any;
  compact?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, compact = false }) => {
  return (
    <div className={`flex ${compact ? 'items-start space-x-4 border-b pb-4' : 'flex-col md:flex-row md:items-start justify-between p-4 border rounded-lg'}`}>
      {compact ? (
        <>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
            <AlertCircle className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{report.title}</p>
              <Badge className={statusColorMap[report.status]}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(report.status)}
                  {report.status.replace('_', ' ')}
                </span>
              </Badge>
            </div>
            <p className="text-sm text-gray-500 line-clamp-1">
              {report.description}
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true })}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{report.title}</h3>
              <Badge className={statusColorMap[report.status]}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(report.status)}
                  {report.status.replace('_', ' ')}
                </span>
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{report.description}</p>
            <div className="flex items-center text-xs text-gray-400 gap-3">
              <span>{report.location.address || 'Unknown location'}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true })}</span>
            </div>
            {report.adminNotes && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                <p className="font-medium">Admin Notes:</p>
                <p>{report.adminNotes}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {report.upvotes} upvotes
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportCard;
