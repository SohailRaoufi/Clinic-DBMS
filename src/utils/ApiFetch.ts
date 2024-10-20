// Define a type for the options we'll accept
type RequestOptions = {
  headers?: HeadersInit;
  params?: Record<string, string>;
  body?: any;
};

type ReturnType = {
  success: boolean;
  status: Number;
  data?: any;
};

// Base URL for your API
const BASE_URL = `http://${import.meta.env.VITE_BACKEND_URL}`;

// Helper function to build URL with query parameters
const buildUrl = (path: string, params?: Record<string, string>): string => {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }
  return url.toString();
};

// Generic function to handle HTTP errors
const handleResponse = async (response: Response): Promise<ReturnType> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    return {
      success: false,
      status: response.status,
      data: errorData || response.statusText,
    };
  }
  const data = await response.json().catch(() => null);
  return { success: true, status: response.status, data: data };
};

const handleServerError = (error: Error) => {
  return { success: false, status: 500, data: { detail: "Server Error!" } };
};

// GET request
export const get = async (
  path: string,
  options: RequestOptions = {}
): Promise<ReturnType> => {
  const { headers = {}, params } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  return handleResponse(response);
};

// POST request
export const post = async (
  path: string,
  options: RequestOptions = {}
): Promise<ReturnType> => {
  const { headers = {}, body } = options;
  const url = buildUrl(path);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    console.log(response);

    return handleResponse(response);
  } catch (e: any) {
    return handleServerError(e);
  }
};

// PUT request
export const put = async (
  path: string,
  options: RequestOptions = {}
): Promise<ReturnType> => {
  const { headers = {}, body } = options;
  const url = buildUrl(path);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  return handleResponse(response);
};

// DELETE request
export const del = async (
  path: string,
  options: RequestOptions = {}
): Promise<ReturnType> => {
  const { headers = {} } = options;
  const url = buildUrl(path);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  return handleResponse(response);
};
