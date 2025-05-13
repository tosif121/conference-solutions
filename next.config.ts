/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    BASE_API_URL: 'https://conf.iotcom.io/api/',
    // Authentication Endpoints
    LOGIN: 'superadmin/login',
    ADMIN_LOGIN: 'admin/login',

    // Conference Call Endpoints
    LIVE_CONF_CALLS: 'liveConf-calls',
    CONF_CALL_DETAIL: 'confCalldetail',
    CREATE_CONFERENCE: 'conferences',
    GET_CONFERENCE_BY_ID: 'conferences',
    UPDATE_CONFERENCE_BY_ID: 'conferences',
    DELETE_CONFERENCE_BY_ID: 'conferences',

    // Admin Management Endpoints
    CREATE_ADMIN: 'admins',
    GET_ADMIN_BY_USERNAME: 'admins',
    UPDATE_ADMIN_BY_USERNAME: 'admins',
    DELETE_ADMIN_BY_USERNAME: 'admins',
    GET_ALL_ADMINS: 'allAdmins',
  },
};

export default nextConfig;
