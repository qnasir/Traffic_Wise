export type ReportType = 'pothole' | 'accident' | 'traffic' | 'construction' | 'other';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type ReportStatus = 'pending' | 'accepted' | 'in_progress' | 'completed';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Report {
  _id: string;
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

export interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
  }
  