
import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";

export type ReportType = 'pothole' | 'accident' | 'traffic' | 'construction' | 'other';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type ReportStatus = 'pending' | 'accepted' | 'in_progress' | 'completed';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  severity: AlertSeverity;
  location: Location;
  imageUrl?: string;
  reportedBy: string;
  reportedAt: Date;
  upvotes: number;
  downvotes: number;
  resolved: boolean;
  status: ReportStatus;
  adminNotes?: string;
  verifiedBy?: string;
  lastUpdated: Date;
}

type AlertsContextType = {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'reportedAt' | 'upvotes' | 'downvotes' | 'resolved' | 'status' | 'lastUpdated'>) => void;
  upvoteReport: (id: string) => void;
  downvoteReport: (id: string) => void;
  markAsResolved: (id: string) => void;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  addAdminNote: (id: string, note: string) => void;
  verifyReport: (id: string, adminId: string) => void;
  getNearbyReports: (location: Location, radiusKm: number) => Report[];
  getReportsByType: (type: ReportType) => Report[];
  getReportsBySeverity: (severity: AlertSeverity) => Report[];
  getReportsByStatus: (status: ReportStatus) => Report[];
  getReportStats: () => {
    totalReports: number;
    resolvedReports: number;
    byType: Record<ReportType, number>;
    byStatus: Record<ReportStatus, number>;
    bySeverity: Record<AlertSeverity, number>;
  };
};

// Sample initial reports data
const initialReports: Report[] = [
  {
    id: '1',
    title: 'Major pothole on Main Street',
    description: 'Large pothole in the right lane causing traffic delays',
    type: 'pothole',
    severity: 'medium',
    location: { lat: 37.7749, lng: -122.4194, address: 'Main St & Market St' },
    reportedBy: 'user-123',
    reportedAt: new Date(Date.now() - 3600000), // 1 hour ago
    upvotes: 5,
    downvotes: 0,
    resolved: false,
    status: 'accepted',
    lastUpdated: new Date(Date.now() - 3000000),
    imageUrl: 'https://www.shutterstock.com/image-photo/hailsham-east-sussex-uk-january-600nw-2425809705.jpg'
  },
  {
    id: '2',
    title: 'Multi-car accident on Highway 101',
    description: 'Three cars involved in collision, emergency services on site',
    type: 'accident',
    severity: 'high',
    location: { lat: 37.7833, lng: -122.4167, address: 'Highway 101 Northbound' },
    reportedBy: 'user-456',
    reportedAt: new Date(Date.now() - 1800000), // 30 minutes ago
    upvotes: 12,
    downvotes: 0,
    resolved: false,
    status: 'in_progress',
    lastUpdated: new Date(Date.now() - 1500000),
    imageUrl: 'https://imengine.prod.srp.navigacloud.com/?uuid=91c9fbe6-0edd-50a9-bbbb-b71a3c508dff&type=primary&q=75&width=1024'
  },
  {
    id: '3',
    title: 'Heavy traffic after baseball game',
    description: 'Congestion expected for the next hour near stadium',
    type: 'traffic',
    severity: 'medium',
    location: { lat: 37.7786, lng: -122.3893, address: 'Near Oracle Park' },
    reportedBy: 'user-789',
    reportedAt: new Date(Date.now() - 900000), // 15 minutes ago
    upvotes: 3,
    downvotes: 1,
    resolved: false,
    status: 'pending',
    lastUpdated: new Date(Date.now() - 900000),
    imageUrl: 'https://media.istockphoto.com/id/148421596/photo/traffic-jam-with-rows-of-cars.jpg?s=612x612&w=0&k=20&c=GeldRtTNo_vMfE7aHxhQY0QoV2DMyzi4LqTOLZL5svc='
  },
  {
    id: '4',
    title: 'Road construction on Oak Street',
    description: 'Lane closures expected for the next week',
    type: 'construction',
    severity: 'low',
    location: { lat: 37.7694, lng: -122.4862, address: 'Oak St & Divisadero St' },
    reportedBy: 'user-101',
    reportedAt: new Date(Date.now() - 86400000), // 1 day ago
    upvotes: 2,
    downvotes: 0,
    resolved: false,
    status: 'completed',
    lastUpdated: new Date(Date.now() - 43200000),
    imageUrl: 'https://www.thecleanwaterproject.com/assets/uploads/images/Garden.JPG'
  }
];

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};

// Calculate distance between two points using the Haversine formula
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(initialReports);

  const addReport = (reportData: Omit<Report, 'id' | 'reportedAt' | 'upvotes' | 'downvotes' | 'resolved' | 'status' | 'lastUpdated'>) => {
    const newReport: Report = {
      ...reportData,
      id: `report-${Date.now()}`,
      reportedAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      resolved: false,
      status: 'pending',
      lastUpdated: new Date(),
    };

    setReports((prevReports) => [newReport, ...prevReports]);
    toast.success("Report submitted successfully!");
  };

  const upvoteReport = (id: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, upvotes: report.upvotes + 1, lastUpdated: new Date() } : report
      )
    );
    toast.success("Report upvoted!");
  };

  const downvoteReport = (id: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, downvotes: report.downvotes + 1, lastUpdated: new Date() } : report
      )
    );
    toast.success("Report downvoted!");
  };

  const markAsResolved = (id: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, resolved: true, status: 'completed', lastUpdated: new Date() } : report
      )
    );
    toast.success("Report marked as resolved!");
  };

  const updateReportStatus = (id: string, status: ReportStatus) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, status, lastUpdated: new Date() } : report
      )
    );
    toast.success(`Report status updated to ${status.replace('_', ' ')}!`);
  };

  const addAdminNote = (id: string, note: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, adminNotes: note, lastUpdated: new Date() } : report
      )
    );
    toast.success("Admin note added to report!");
  };

  const verifyReport = (id: string, adminId: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, verifiedBy: adminId, status: 'accepted', lastUpdated: new Date() } : report
      )
    );
    toast.success("Report verified!");
  };

  const getNearbyReports = (location: Location, radiusKm: number) => {
    return reports.filter((report) => {
      const distance = getDistanceFromLatLonInKm(
        location.lat,
        location.lng,
        report.location.lat,
        report.location.lng
      );
      return distance <= radiusKm;
    });
  };

  const getReportsByType = (type: ReportType) => {
    return reports.filter((report) => report.type === type);
  };

  const getReportsBySeverity = (severity: AlertSeverity) => {
    return reports.filter((report) => report.severity === severity);
  };

  const getReportsByStatus = (status: ReportStatus) => {
    return reports.filter((report) => report.status === status);
  };

  const getReportStats = () => {
    const totalReports = reports.length;
    const resolvedReports = reports.filter(report => report.resolved).length;
    
    // Count by type
    const byType = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<ReportType, number>);
    
    // Count by status
    const byStatus = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<ReportStatus, number>);
    
    // Count by severity
    const bySeverity = reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {} as Record<AlertSeverity, number>);
    
    return {
      totalReports,
      resolvedReports,
      byType,
      byStatus,
      bySeverity,
    };
  };

  return (
    <AlertsContext.Provider
      value={{
        reports,
        addReport,
        upvoteReport,
        downvoteReport,
        markAsResolved,
        updateReportStatus,
        addAdminNote,
        verifyReport,
        getNearbyReports,
        getReportsByType,
        getReportsBySeverity,
        getReportsByStatus,
        getReportStats,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};
