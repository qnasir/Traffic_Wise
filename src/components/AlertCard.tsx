
import React, { useState } from 'react';
import { Report, useAlerts, ReportStatus } from '@/context/AlertsContext';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  ThumbsUp,
  ThumbsDown,
  Clock, 
  MapPin, 
  Check, 
  AlertTriangle, 
  Construction, 
  Car,
  Loader,
  CheckCircle
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface AlertCardProps {
  report: Report;
}

const AlertCard: React.FC<AlertCardProps> = ({ report }) => {
  const { upvoteReport, downvoteReport, markAsResolved } = useAlerts();
  const [ isAuthenticated, setIsAuthenticated ] = useState(true);

  // Format the timestamp
  const timeAgo = formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true });
  const lastUpdatedAgo = formatDistanceToNow(new Date(report.lastUpdated), { addSuffix: true });

  // Get appropriate icon for report type
  const getReportIcon = (type: string) => {
    switch (type) {
      case 'accident': return <AlertCircle className="text-alert-high" />;
      case 'pothole': return <AlertTriangle className="text-alert-medium" />;
      case 'traffic': return <Car className="text-alert-medium" />;
      case 'construction': return <Construction className="text-alert-low" />;
      default: return <AlertTriangle className="text-alert-medium" />;
    }
  };

  // Get color class based on severity
  const getSeverityColorClass = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-alert-high/10 text-alert-high border-alert-high/30';
      case 'medium': return 'bg-alert-medium/10 text-alert-medium border-alert-medium/30';
      case 'low': return 'bg-alert-low/10 text-alert-low border-alert-low/30';
      default: return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  // Get status information
  const getStatusInfo = (status: ReportStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'Pending',
          colorClass: 'bg-gray-100 text-gray-500 border-gray-300'
        };
      case 'accepted':
        return {
          icon: <Check className="w-4 h-4" />,
          label: 'Accepted',
          colorClass: 'bg-blue-100 text-blue-600 border-blue-300'
        };
      case 'in_progress':
        return {
          icon: <Loader className="w-4 h-4 animate-spin" />,
          label: 'In Progress',
          colorClass: 'bg-amber-100 text-amber-600 border-amber-300'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Completed',
          colorClass: 'bg-green-100 text-green-600 border-green-300'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'Unknown',
          colorClass: 'bg-gray-100 text-gray-500 border-gray-300'
        };
    }
  };

  const statusInfo = getStatusInfo(report.status);

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      report.resolved ? 'opacity-70' : 'hover:shadow-lg'
    }`}>
      {report.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={report.imageUrl} 
            alt={report.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge 
            variant="outline" 
            className={`${getSeverityColorClass(report.severity)} capitalize flex items-center gap-1 mb-2`}
          >
            {getReportIcon(report.type)}
            {report.type}
          </Badge>

          <Badge 
            variant="outline" 
            className={`${statusInfo.colorClass} flex items-center gap-1`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-2">{report.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
          {report.description}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate max-w-[140px]">{report.location.address || 'Location unavailable'}</span>
          </div>
        </div>
        
        {report.adminNotes && (
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-xs">
            <p className="font-medium text-blue-700 dark:text-blue-400">Admin Note:</p>
            <p className="text-gray-700 dark:text-gray-300">{report.adminNotes}</p>
          </div>
        )}
        
        {report.verifiedBy && (
          <div className="mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              Verified
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost" 
            size="sm"
            className="text-gray-500 dark:text-gray-400 hover:text-primary"
            onClick={() => upvoteReport(report.id)}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            <span>{report.upvotes}</span>
          </Button>
          
          <Button
            variant="ghost" 
            size="sm"
            className="text-gray-500 dark:text-gray-400 hover:text-destructive"
            onClick={() => downvoteReport(report.id)}
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            <span>{report.downvotes}</span>
          </Button>
        </div>

        {isAuthenticated && !report.resolved && (
          <Button
            variant="outline"
            size="sm" 
            onClick={() => markAsResolved(report.id)}
          >
            <Check className="w-4 h-4 mr-1" />
            <span>Mark Resolved</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AlertCard;
