import Axios from 'axios';
import Cookies from 'js-cookie';

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
  Cookies.remove('conference_token');
  Cookies.remove('user_role');

  const currentPath = window.location.pathname;
  const redirectUrl = currentPath.startsWith('/super-admin') ? '/super-admin/login' : '/admin/login';

  window.location.href = redirectUrl;
}

async function makeRequest(method, url, params, contentType = 'application/json') {
  try {
    const headers = generateHeaders(contentType);

    switch (method.toUpperCase()) {
      case 'GET':
        return handleResponse((await Axios.get(url, { ...headers, params })).data);

      case 'POST':
        return handleResponse((await Axios.post(url, params, headers)).data);

      case 'PUT':
        return handleResponse((await Axios.put(url, params, headers)).data);

      case 'DELETE':
        return handleResponse((await Axios.delete(url, { ...headers, data: params })).data);

      default:
        return errorResponse({ message: `Unsupported request method: ${method}` });
    }
  } catch (error) {
    const status = error?.response?.status;
    if ([400, 403, 500].includes(status)) {
      logoutAndRedirect();
      return errorResponse({
        message: 'Session expired or unauthorized. Redirecting to login.',
      });
    }
    return errorResponse({
      message: error?.response?.data?.message || 'Request failed.',
    });
  }
}

async function fetcher(method, url, params) {
  return makeRequest(method, url, params);
}

async function filesFetch(method, url, params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => formData.append(key, params[key]));

  return makeRequest(method, url, formData, 'multipart/form-data');
}

function handleResponse(response) {
  if (response.success) {
    return successResponse(response);
  } else {
    return errorResponse(response);
  }
}

function successResponse(response) {
  const { message } = response;
  return {
    status: true,
    data: response,
    message,
  };
}

function errorResponse(response) {
  return {
    status: false,
    data: null,
    message: response?.message || 'An error occurred.',
  };
}

export { fetcher, filesFetch };
