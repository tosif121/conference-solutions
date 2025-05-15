// apiServices.js
import { fetcher, filesFetch, axiosInstance } from './apiBase';

// Base URL configuration
const apiUrl = 'https://conf.iotcom.io/api/';

/**
 * Authentication Services
 * Handles all authentication-related API endpoints
 */
export const authService = {
  // Superadmin authentication
  superAdminLogin: (credentials) => fetcher('POST', apiUrl + 'superadmin/login', credentials),

  // Admin authentication
  adminLogin: (credentials) => fetcher('POST', apiUrl + 'admin/login', credentials),
  
  // Logout user (clears tokens on server)
  logout: () => fetcher('POST', apiUrl + 'logout', {}),
  
  // Refresh token
  refreshToken: () => fetcher('POST', apiUrl + 'refresh-token', {})
};

/**
 * Conference Call Services
 * Endpoints related to active conference calls and their data
 */
export const conferenceCallService = {
  // Get all live conference calls
  getLiveConferenceCalls: (params = {}) => fetcher('GET', apiUrl + 'liveConf-calls', params),

  // Get call data by date range
  getCallDataByDateRange: (dateRange) => fetcher('POST', apiUrl + 'confCalldetail', dateRange),
  
  // Get detailed analytics for a specific call
  getCallAnalytics: (callId) => fetcher('GET', apiUrl + `calls/${callId}/analytics`, {}),
  
  // Get participant list for a specific call
  getCallParticipants: (callId) => fetcher('GET', apiUrl + `calls/${callId}/participants`, {}),
  
  // Get call recordings
  getCallRecordings: (callId) => fetcher('GET', apiUrl + `calls/${callId}/recordings`, {})
};

/**
 * Conference Management Services
 * CRUD operations for conference setup and configuration
 */
export const conferenceService = {
  // Create a new conference
  createConference: (conferenceData) => fetcher('POST', apiUrl + 'conferences', conferenceData),

  // Get all conferences
  getAllConferences: (params = {}) => fetcher('GET', apiUrl + 'conferences', params),

  // Get conference by ID
  getConferenceById: (id) => fetcher('GET', apiUrl + `conferences/${id}`, {}),

  // Update conference by ID
  updateConference: (id, conferenceData) => fetcher('PUT', apiUrl + `conferences/${id}`, conferenceData),

  // Delete conference by ID (soft delete)
  deleteConference: (id) => fetcher('DELETE', apiUrl + `conferences/${id}`, {}),
  
  // Hard delete a conference (permanent)
  hardDeleteConference: (id) => fetcher('DELETE', apiUrl + `conferences/${id}/permanent`, {}),
  
  // Duplicate an existing conference
  duplicateConference: (id) => fetcher('POST', apiUrl + `conferences/${id}/duplicate`, {}),
  
  // Import conference settings from file
  importConference: (fileData) => filesFetch('POST', apiUrl + 'conferences/import', fileData),
  
  // Export conference settings to file
  exportConference: (id) => fetcher('GET', apiUrl + `conferences/${id}/export`, {})
};

/**
 * Admin Management Services
 * CRUD operations for admin user management
 */
export const adminService = {
  // Create a new admin
  createAdmin: (adminData) => fetcher('POST', apiUrl + 'admins', adminData),

  // Get admin by username
  getAdminByUsername: (username) => fetcher('GET', apiUrl + `admins/${username}`, {}),

  // Update admin by username
  updateAdmin: (username, adminData) => fetcher('PUT', apiUrl + `admins/${username}`, adminData),

  // Delete admin by username (soft delete)
  deleteAdmin: (username) => fetcher('DELETE', apiUrl + `admins/${username}`, {}),

  // Get all admin users
  getAllAdmins: (params = {}) => fetcher('GET', apiUrl + 'allAdmins', params),
  
  // Reset admin password
  resetAdminPassword: (username) => fetcher('POST', apiUrl + `admins/${username}/reset-password`, {}),
  
  // Change admin password
  changeAdminPassword: (username, passwordData) => fetcher('PUT', apiUrl + `admins/${username}/password`, passwordData),
  
  // Update admin profile picture
  updateAdminProfilePic: (username, imageFile) => filesFetch('POST', apiUrl + `admins/${username}/profile-pic`, { image: imageFile })
};

/**
 * Channel Management Services
 * Endpoints for controlling active call channels
 */
export const channelService = {
  // Mute or unmute a specific channel
  toggleChannelMute: (channelId, muteParams) => fetcher('POST', apiUrl + `channels/${channelId}/mute`, muteParams),

  // Hang up a specific channel
  hangupChannel: (channelId) => fetcher('POST', apiUrl + `channels/${channelId}/hangup`, {}),
  
  // Get channel information
  getChannelInfo: (channelId) => fetcher('GET', apiUrl + `channels/${channelId}`, {}),
  
  // Set channel volume
  setChannelVolume: (channelId, volumeParams) => fetcher('POST', apiUrl + `channels/${channelId}/volume`, volumeParams),
  
  // Send DTMF tones to a channel
  sendDTMF: (channelId, dtmfParams) => fetcher('POST', apiUrl + `channels/${channelId}/dtmf`, dtmfParams)
};

/**
 * DID (Direct Inward Dialing) Services
 * CRUD operations for DID number management
 */
export const didService = {
  // Create a new DID
  createDID: (didData) => fetcher('POST', apiUrl + 'DIDs', didData),

  // Get DID details by number
  getDIDByNumber: (number) => fetcher('GET', apiUrl + `DIDs/${number}`, {}),

  // Update a DID by number
  updateDID: (number, didData) => fetcher('PUT', apiUrl + `DIDs/${number}`, didData),

  // Delete a DID by number (soft delete)
  deleteDID: (number) => fetcher('DELETE', apiUrl + `DIDs/${number}`, {}),

  // Get all DIDs
  getAllDIDs: (params = {}) => fetcher('GET', apiUrl + 'DIDs', params),
  
  // Assign DID to a conference
  assignDIDToConference: (number, conferenceId) => fetcher('POST', apiUrl + `DIDs/${number}/assign`, { conferenceId }),
  
  // Bulk import DIDs from CSV
  bulkImportDIDs: (csvFile) => filesFetch('POST', apiUrl + 'DIDs/bulk-import', { file: csvFile }),
  
  // Get available DID count
  getAvailableDIDCount: () => fetcher('GET', apiUrl + 'DIDs/available-count', {})
};

/**
 * Report Services
 * Endpoints for generating and retrieving reports
 */
export const reportService = {
  // Get usage report by date range
  getUsageReport: (dateRange) => fetcher('POST', apiUrl + 'reports/usage', dateRange),
  
  // Get analytics summary
  getAnalyticsSummary: (params = {}) => fetcher('GET', apiUrl + 'reports/analytics', params),
  
  // Generate PDF report
  generatePDFReport: (reportParams) => fetcher('POST', apiUrl + 'reports/generate-pdf', reportParams),
  
  // Export report to CSV
  exportReportToCSV: (reportParams) => fetcher('POST', apiUrl + 'reports/export-csv', reportParams)
};

/**
 * Dashboard Services
 * Endpoints for dashboard-specific data
 */
export const dashboardService = {
  // Get dashboard summary statistics
  getDashboardStats: () => fetcher('GET', apiUrl + 'dashboard/stats', {}),
  
  // Get active call count
  getActiveCallCount: () => fetcher('GET', apiUrl + 'dashboard/active-calls', {}),
  
  // Get recent activity logs
  getRecentActivity: (limit = 10) => fetcher('GET', apiUrl + 'dashboard/recent-activity', { limit })
};

/**
 * System Services
 * System-level operations and settings
 */
export const systemService = {
  // Get system status
  getSystemStatus: () => fetcher('GET', apiUrl + 'system/status', {}),
  
  // Update system settings
  updateSystemSettings: (settings) => fetcher('PUT', apiUrl + 'system/settings', settings),
  
  // Get system logs
  getSystemLogs: (params = {}) => fetcher('GET', apiUrl + 'system/logs', params),
  
  // Perform system maintenance tasks
  performMaintenance: (maintenanceType) => fetcher('POST', apiUrl + 'system/maintenance', { type: maintenanceType })
};

// Direct access to the Axios instance for custom requests
export { axiosInstance };

// Default export of all services
export default {
  auth: authService,
  conferenceCall: conferenceCallService,
  conference: conferenceService,
  admin: adminService,
  channel: channelService,
  did: didService,
  report: reportService,
  dashboard: dashboardService,
  system: systemService
};