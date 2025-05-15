import Axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Create axios instance with default configuration
const axiosInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: 30000, // 30 seconds timeout
});

// Function to generate headers for requests
function generateHeaders(contentType = 'application/json') {
  const headers = {
    'Content-Type': contentType,
  };

  const token = Cookies.get('conference_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return { headers };
}

function logoutAndRedirect() {
  setTimeout(() => {
    Cookies.remove('conference_token');
    Cookies.remove('user_role');

    const currentPath = window.location.pathname;

    // Determine the appropriate login path based on current location
    const loginPath = currentPath.startsWith('/super-admin') ? '/super-admin/login' : '/admin/login';

    // Only redirect if not already on a login page
    if (currentPath !== loginPath && !currentPath.endsWith('/login')) {
      window.location.href = loginPath;
    }
  }, 5000);
}

// Setup request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token to every request if available
    const token = Cookies.get('conference_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Setup response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    // Check if error status is one of the critical ones
    if ([400, 403, 502].includes(status)) {
      // Check current path before redirecting
      const currentPath = window.location.pathname;
      const loginPaths = ['/super-admin/login', '/admin/login', '/login'];

      // Show error toast with a generic message
      toast.error('Session expired or unauthorized or internal server error');

      // Only redirect if not already on a login page
      if (!loginPaths.some((path) => currentPath === path || currentPath.endsWith('/login'))) {
        logoutAndRedirect();
      }
    } else {
      // Handle other errors
      const errorMessage = error?.response?.data?.message || 'Request failed';
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// Helper functions for API requests
async function makeRequest(method, url, params, contentType = 'application/json') {
  try {
    const config = {
      headers: { 'Content-Type': contentType },
    };

    let response;

    switch (method.toUpperCase()) {
      case 'GET':
        response = await axiosInstance.get(url, { ...config, params });
        break;
      case 'POST':
        response = await axiosInstance.post(url, params, config);
        break;
      case 'PUT':
        response = await axiosInstance.put(url, params, config);
        break;
      case 'DELETE':
        response = await axiosInstance.delete(url, { ...config, data: params });
        break;
      default:
        return errorResponse({ message: `Unsupported request method: ${method}` });
    }

    return handleResponse(response.data);
  } catch (error) {
    // Return standardized error response
    return errorResponse({
      message: error?.response?.data?.message || 'Request failed',
    });
    // Note: We don't need to handle error.response.status here as it's already handled by the axios interceptor
  }
}

// Standard fetcher for JSON requests
async function fetcher(method, url, params) {
  return makeRequest(method, url, params);
}

// Specialized fetcher for file uploads
async function filesFetch(method, url, params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => formData.append(key, params[key]));

  return makeRequest(method, url, formData, 'multipart/form-data');
}

// Helper functions for standardizing responses
function handleResponse(response) {
  if (response.success) {
    return successResponse(response);
  } else {
    return errorResponse(response);
  }
}

function successResponse(response) {
  return {
    status: true,
    data: response,
    message: response?.message || 'Operation successful',
  };
}

function errorResponse(response) {
  return {
    status: false,
    data: null,
    message: response?.message || 'An error occurred',
  };
}

export { fetcher, filesFetch };
