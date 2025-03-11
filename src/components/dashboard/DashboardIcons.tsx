
import { 
    User, 
    Bell, 
    MapPin, 
    FileText, 
    CheckCircle, 
    Activity, 
    Award,
    Clock,
    AlertCircle,
    Loader
  } from 'lucide-react';
  
  export {
    User,
    Bell,
    MapPin,
    FileText,
    CheckCircle,
    Activity,
    Award,
    Clock,
    AlertCircle,
    Loader
  };
  
  export const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'accepted': return <CheckCircle size={16} />;
      case 'in_progress': return <Loader size={16} className="animate-spin" />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };
  
  export const statusColorMap = {
    pending: 'bg-gray-100 text-gray-700',
    accepted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700'
  };
  