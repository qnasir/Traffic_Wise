import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Report, ReportState } from '../../types/report.types'; 
import { toast } from 'sonner';

// Fetch reports
export const fetchReports = createAsyncThunk(
  'report/fetchReports',
   async (creadentials: Report) => {
    console.log("creadentials", creadentials);
    return;
          try {
              const response = await axios.post('/api/users/login', creadentials);
              return response.data;
  
          } catch (error) {
              console.log("error", error);
          }
      }
);

// Create report
export const createReport = createAsyncThunk(
  'report/createReport',
  async (reportData: Omit<Report, '_id' | 'reportedAt' | 'upvotes' | 'downvotes' | 'resolved' | 'status' | 'adminNotes' | 'verifiedBy' | 'lastUpdated'>) => {

    const response = await axios.post('/api/reports', reportData);
    return response.data.report;
  }
);

// Update report
export const updateReport = createAsyncThunk(
  'report/updateReport',
  async (reportData: Report) => {
    const response = await axios.put(`/api/reports/${reportData._id}`, reportData);
    return response.data;
  }
);

// Delete report
export const deleteReport = createAsyncThunk(
  'report/deleteReport',
  async (reportId: string) => {
    await axios.delete(`/api/reports/${reportId}`);
    return reportId;
  }
);

const initialState: ReportState = {
  reports: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reports
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      })
      // Create report
      .addCase(createReport.fulfilled, (state, action: PayloadAction<Report>) => {
        state.loading = false;
        state.reports.push(action.payload);
        toast.success("Issue reported successfully")
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create report';
      })
      // Update report
      .addCase(updateReport.fulfilled, (state, action: PayloadAction<Report>) => {
        state.loading = false;
        state.reports = state.reports.map((report) =>
          report._id === action.payload._id ? action.payload : report
        );
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update report';
      })
      // Delete report
      .addCase(deleteReport.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.reports = state.reports.filter((report) => report._id !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete report';
      });
  },
});

export default reportSlice.reducer;