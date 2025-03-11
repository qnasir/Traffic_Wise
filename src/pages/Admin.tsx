import React, { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  useAlerts,
  Report,
  ReportStatus,
  ReportType,
  AlertSeverity,
} from "@/context/AlertsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const PieChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.PieChart }))
);
const Pie = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.Pie }))
);
const BarChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.BarChart }))
);
const Bar = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.Bar }))
);
const XAxis = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.XAxis }))
);
const YAxis = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.YAxis }))
);
const CartesianGrid = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.CartesianGrid }))
);
const Tooltip = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.Tooltip }))
);
const Legend = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.Legend }))
);
const Cell = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.Cell }))
);
const ResponsiveContainer = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.ResponsiveContainer }))
);
import {
  Shield,
  Edit,
  CheckCircle,
  Clock,
  Loader,
  AlertCircle,
  BarChart2,
  PieChart as PieChartIcon,
  Search,
  Filter,
  ListFilter,
  TrafficCone,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const {
    reports,
    updateReportStatus,
    addAdminNote,
    verifyReport,
    getReportsByStatus,
    getReportStats,
  } = useAlerts();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");

  React.useEffect(() => {
    // Redirect non-admin users
    if (isAuthenticated === false || (isAuthenticated && !isAdmin)) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const statusColorMap: Record<ReportStatus, string> = {
    pending: "bg-gray-100 text-gray-700",
    accepted: "bg-blue-100 text-blue-700",
    in_progress: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
  };

  const typeIconMap: Record<ReportType, React.ReactNode> = {
    pothole: <AlertCircle size={16} />,
    accident: <AlertCircle size={16} />,
    traffic: <TrafficCone size={16} />,
    construction: <Loader size={16} />,
    other: <AlertCircle size={16} />,
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      case "in_progress":
        return <Loader size={16} className="animate-spin" />;
      case "completed":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "low":
        return "#4ade80";
      case "medium":
        return "#fbbf24";
      case "high":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      !searchQuery ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filterStatus || report.status === filterStatus;
    const matchesType = !filterType || report.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort by newest first
  const sortedReports = [...filteredReports].sort(
    (a, b) =>
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  // Stats data
  const stats = getReportStats();

  // Transform stats for charts
  const statusChartData = Object.entries(stats.byStatus).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
      value,
    })
  );

  const typeChartData = Object.entries(stats.byType).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  const severityChartData = Object.entries(stats.bySeverity).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setAdminNote(report.adminNotes || "");
    setEditDialogOpen(true);
  };

  const handleVerifyReport = (report: Report) => {
    if (user) {
      verifyReport(report.id, user.id);
    }
  };

  const handleUpdateStatus = () => {
    if (selectedReport) {
      updateReportStatus(selectedReport.id, selectedReport.status);
      if (adminNote) {
        addAdminNote(selectedReport.id, adminNote);
      }
      setEditDialogOpen(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage reports, update statuses, and view insights
              </p>
            </div>

            <div className="flex items-center mt-4 md:mt-0">
              <Badge className="bg-primary text-white mr-2">Admin Access</Badge>
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Logged in as {user.email}
                </span>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <ListFilter size={16} />
                <span>Manage Reports</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart2 size={16} />
                <span>Statistics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>All Reports</CardTitle>
                  <CardDescription>
                    View, verify, and update all user-submitted reports
                  </CardDescription>

                  <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search reports..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) =>
                          setFilterStatus(value === "all" ? null : value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <span className="flex items-center">
                            <Filter className="mr-2 h-4 w-4" />
                            <span>Status</span>
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={(value) =>
                          setFilterType(value === "all" ? null : value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <span className="flex items-center">
                            <Filter className="mr-2 h-4 w-4" />
                            <span>Type</span>
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="pothole">Pothole</SelectItem>
                          <SelectItem value="accident">Accident</SelectItem>
                          <SelectItem value="traffic">Traffic</SelectItem>
                          <SelectItem value="construction">
                            Construction
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left font-medium">
                            Report
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Type
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Reported
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedReports.length > 0 ? (
                          sortedReports.map((report) => (
                            <tr
                              key={report.id}
                              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{report.title}</p>
                                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                    {report.description}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  {typeIconMap[report.type]}
                                  <span className="capitalize">
                                    {report.type}
                                  </span>
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  className={`${
                                    statusColorMap[report.status]
                                  } flex items-center gap-1`}
                                >
                                  {getStatusIcon(report.status)}
                                  <span className="capitalize">
                                    {report.status.replace("_", " ")}
                                  </span>
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {formatDistanceToNow(
                                  new Date(report.reportedAt),
                                  { addSuffix: true }
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditReport(report)}
                                  >
                                    <Edit size={14} className="mr-1" />
                                    Edit
                                  </Button>

                                  {!report.verifiedBy && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleVerifyReport(report)}
                                    >
                                      <Shield size={14} className="mr-1" />
                                      Verify
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-10 text-center text-gray-500"
                            >
                              No reports match your filters
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
                      <CardTitle>Reports by Status</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <Suspense fallback={<div>Loading Chart...</div>}>
                          <PieChart>
                            <Pie
                              data={statusChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {statusChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </Suspense>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                      <CardTitle>Reports by Type</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                      <CardTitle>Reports by Severity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={severityChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value">
                            {severityChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={getSeverityColor(
                                  entry.name.toLowerCase() as AlertSeverity
                                )}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Summary Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary">
                          {stats.totalReports}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Total Reports
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-500">
                          {stats.resolvedReports}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Resolved
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                        <p className="text-2xl font-bold text-amber-500">
                          {stats.byStatus.in_progress || 0}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          In Progress
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-500">
                          {stats.byStatus.pending || 0}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Pending
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Edit Report Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>
              Update report status and add admin notes
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-title" className="text-right">
                  Title
                </Label>
                <div className="col-span-3 font-medium">
                  {selectedReport.title}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedReport.status}
                  onValueChange={(value: ReportStatus) =>
                    setSelectedReport({ ...selectedReport, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="admin-notes" className="text-right pt-2">
                  Admin Notes
                </Label>
                <Textarea
                  id="admin-notes"
                  className="col-span-3"
                  placeholder="Add notes that will be visible to users"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
