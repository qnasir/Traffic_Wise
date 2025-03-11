
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Map from '@/components/Map';
import AlertCard from '@/components/AlertCard';
import ReportForm from '@/components/ReportForm';
import Footer from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import { useAlerts, ReportType, AlertSeverity } from '@/context/AlertsContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Construction, Car, Filter } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { reports } = useAlerts();
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [showHeroSection, setShowHeroSection] = useState(true);

  // Check if user is at the top of the page
  useEffect(() => {
    const handleScroll = () => {
      const isAtTop = window.scrollY < 100;
      setShowHeroSection(isAtTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered reports based on active tab, search query, and severity filter
  const filteredReports = reports.filter(report => {
    // First filter by tab (report type)
    if (activeTab !== 'all' && report.type !== activeTab) {
      return false;
    }
    
    // Then filter by search query
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !report.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Finally filter by severity if a filter is selected
    if (filterSeverity && report.severity !== filterSeverity) {
      return false;
    }
    
    return true;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast.info(`Showing ${value === 'all' ? 'all reports' : `${value} reports`}`);
  };

  const handleSeverityFilter = (severity: AlertSeverity | null) => {
    setFilterSeverity(severity);
    
    if (severity) {
      toast.info(`Filtered by ${severity} severity`);
    } else {
      toast.info('All severities shown');
    }
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      // Scroll to report form
      const reportSection = document.getElementById('report-section');
      if (reportSection) {
        reportSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Map Overlay */}
      <section 
        className={`relative transition-all duration-300 ${showHeroSection ? 'h-[100vh] opacity-100' : 'h-[100vh] opacity-95'}`}
      >
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
          <Map />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Crowdsourced Road Safety & Traffic Alerts
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Join thousands of drivers helping each other navigate safely with real-time road alerts, traffic updates, and hazard warnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg shadow-lg"
                onClick={handleReportClick}
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report an Issue
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-6 text-lg"
                onClick={() => {
                  const reportsSection = document.getElementById('reports');
                  if (reportsSection) {
                    reportsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View Reports
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-20"></div>
      </section>
      
      {/* Reports Section */}
      <section id="reports" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl font-bold mb-4">Recent Traffic & Safety Reports</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay informed about road conditions with real-time updates from other drivers in your area.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search reports..."
                className="pl-10 glass-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Severity:
              </span>
              
              <Badge 
                variant="outline"
                className={`cursor-pointer ${!filterSeverity ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => handleSeverityFilter(null)}
              >
                All
              </Badge>
              <Badge 
                variant="outline"
                className={`cursor-pointer ${filterSeverity === 'low' ? 'bg-alert-low/20 text-alert-low border-alert-low/30' : ''}`}
                onClick={() => handleSeverityFilter('low')}
              >
                <div className="w-2 h-2 rounded-full bg-alert-low mr-1"></div>
                Low
              </Badge>
              <Badge 
                variant="outline"
                className={`cursor-pointer ${filterSeverity === 'medium' ? 'bg-alert-medium/20 text-alert-medium border-alert-medium/30' : ''}`}
                onClick={() => handleSeverityFilter('medium')}
              >
                <div className="w-2 h-2 rounded-full bg-alert-medium mr-1"></div>
                Medium
              </Badge>
              <Badge 
                variant="outline"
                className={`cursor-pointer ${filterSeverity === 'high' ? 'bg-alert-high/20 text-alert-high border-alert-high/30' : ''}`}
                onClick={() => handleSeverityFilter('high')}
              >
                <div className="w-2 h-2 rounded-full bg-alert-high mr-1"></div>
                High
              </Badge>
            </div>
          </div>
          
          {/* Tabs for report types */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="grid grid-cols-5 md:w-[600px] mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="accident" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Accidents</span>
              </TabsTrigger>
              <TabsTrigger value="pothole" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Potholes</span>
              </TabsTrigger>
              <TabsTrigger value="traffic" className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                <span>Traffic</span>
              </TabsTrigger>
              <TabsTrigger value="construction" className="flex items-center gap-1">
                <Construction className="h-3 w-3" />
                <span>Construction</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Reports Grid */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="animate-fade-up">
                  <AlertCard report={report} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No reports found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery 
                  ? 'No reports match your search criteria. Try different keywords.' 
                  : 'No reports for the selected filter. Try a different category or severity.'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                  setFilterSeverity(null);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Report Form Section */}
      <section id="report-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Report a Road Issue</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Help keep our roads safe by reporting hazards, traffic jams, accidents, or construction.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <ReportForm />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="about" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How TrafficWise Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A community-driven platform helping drivers navigate roads safely.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="neo-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Report Issues</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quickly report road hazards, traffic jams, accidents, or construction with your mobile device.
              </p>
            </div>
            
            <div className="neo-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive real-time notifications about nearby road conditions and hazards while driving.
              </p>
            </div>
            
            <div className="neo-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Drive Safer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Make informed decisions, avoid hazards, and contribute to safer roads for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};

export default Index;
