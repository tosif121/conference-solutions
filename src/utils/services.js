// apiServices.js
import { fetcher } from './apiBase';

// Base URL configuration
const apiUrl = 'https://conf.iotcom.io/api/';

// ===== Authentication Services =====
export const authService = {
  // Superadmin authentication
  superAdminLogin: (credentials) => fetcher('POST', apiUrl + 'superadmin/login', credentials),

  // Admin authentication
  adminLogin: (credentials) => fetcher('POST', apiUrl + 'admin/login', credentials),
};

// ===== Conference Call Services =====
export const conferenceCallService = {
  // Get all live conference calls
  getLiveConferenceCalls: (params = {}) => fetcher('GET', apiUrl + 'liveConf-calls', params),

  // Get call data by date range
  getCallDataByDateRange: (dateRange) => fetcher('POST', apiUrl + 'confCalldetail', dateRange),
};

// ===== Conference Management Services =====
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
};

// ===== Admin Management Services =====
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
};

// ===== Channel Management Services =====
export const channelService = {
  // Mute or unmute a specific channel
  toggleChannelMute: (channelId, muteParams) => fetcher('POST', apiUrl + `channels/${channelId}/mute`, muteParams),

  // Hang up a specific channel
  hangupChannel: (channelId) => fetcher('POST', apiUrl + `channels/${channelId}/hangup`, {}),
};

// ===== DID (Direct Inward Dialing) Services =====
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
};
