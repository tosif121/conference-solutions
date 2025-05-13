import { fetcher, filesFetch } from "./apiBase";
const apiUrl = (endpoint) => `${process.env.BASE_API_URL}${endpoint}`;

// Authentication Endpoints
export const superAdminLogin = (params) => fetcher('POST', apiUrl(process.env.LOGIN), params);
export const adminLogin = (params) => fetcher('POST', apiUrl(process.env.ADMIN_LOGIN), params);

// Conference Call Endpoints
export const getLiveConfCalls = (params) => fetcher('GET', apiUrl(process.env.LIVE_CONF_CALLS), params);
export const getConfCallDetail = (id) => fetcher('GET', apiUrl(`${process.env.CONF_CALL_DETAIL}/${id}`), {});

// Conference Management
export const createConference = (params) => fetcher('POST', apiUrl(process.env.CREATE_CONFERENCE), params);
export const getConferenceById = (id) => fetcher('GET', apiUrl(`${process.env.GET_CONFERENCE_BY_ID}/${id}`), {});
export const getAllConferences = (params) => fetcher('GET', apiUrl(process.env.GET_CONFERENCE_BY_ID), params);
export const updateConference = (id, params) => fetcher('PUT', apiUrl(`${process.env.UPDATE_CONFERENCE_BY_ID}/${id}`), params);
export const deleteConference = (id) => fetcher('DELETE', apiUrl(`${process.env.DELETE_CONFERENCE_BY_ID}/${id}`), {});

// Admin Management
export const createAdmin = (params) => fetcher('POST', apiUrl(process.env.CREATE_ADMIN), params);
export const getAdminByUsername = (username) => fetcher('GET', apiUrl(`${process.env.GET_ADMIN_BY_USERNAME}/${username}`), {});
export const updateAdmin = (username, params) => fetcher('PUT', apiUrl(`${process.env.UPDATE_ADMIN_BY_USERNAME}/${username}`), params);
export const deleteAdmin = (username) => fetcher('DELETE', apiUrl(`${process.env.DELETE_ADMIN_BY_USERNAME}/${username}`), {});
export const getAllAdmins = (params) => fetcher('GET', apiUrl(process.env.GET_ALL_ADMINS), params);