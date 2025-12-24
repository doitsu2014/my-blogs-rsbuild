/**
 * API Configuration
 *
 * This file centralizes all API endpoint configurations using environment variables.
 * All API calls should use these helper functions instead of hardcoded URLs.
 */

/**
 * Get the REST API base URL from environment variables
 * Falls back to relative path if not configured
 */
export const getRestApiBaseUrl = (): string => {
  return import.meta.env.PUBLIC_REST_API_URL || '';
};

/**
 * Get the GraphQL API URL from environment variables
 */
export const getGraphQLApiUrl = (): string => {
  return import.meta.env.PUBLIC_GRAPHQL_API_URL || 'http://localhost:8989/graphql';
};

/**
 * Get the Media Upload API URL from environment variables
 */
export const getMediaUploadApiUrl = (): string => {
  return import.meta.env.PUBLIC_MEDIA_UPLOAD_API_URL || 'http://localhost:8989/api/media/upload';
};

/**
 * Helper function to construct full API URL
 * @param path - API endpoint path (e.g., '/admin/blogs' or 'admin/blogs')
 * @returns Full API URL
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = getRestApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If baseUrl is empty, return the path as-is (relative)
  if (!baseUrl) {
    return `/api${cleanPath}`;
  }

  // Remove trailing slash from baseUrl and ensure path starts with /
  return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
};

/**
 * Create headers with authentication token
 * @param token - JWT access token from Keycloak
 * @param additionalHeaders - Additional headers to include
 * @returns Headers object with Authorization
 */
export const createAuthHeaders = (
  token: string | null,
  additionalHeaders?: HeadersInit
): HeadersInit => {
  const headers: Record<string, string> = {
    ...(additionalHeaders as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Authenticated fetch wrapper
 * Automatically includes Authorization header with Bearer token
 *
 * @param url - API endpoint URL
 * @param token - JWT access token from Keycloak
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise<Response>
 *
 * @example
 * const response = await authenticatedFetch(
 *   getApiUrl('/admin/blogs'),
 *   token,
 *   { method: 'GET' }
 * );
 */
export const authenticatedFetch = async (
  url: string,
  token: string | null,
  options?: RequestInit
): Promise<Response> => {
  const headers = createAuthHeaders(token, options?.headers);

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * API Configuration object for easy access
 */
export const API_CONFIG = {
  REST_BASE: getRestApiBaseUrl(),
  GRAPHQL: getGraphQLApiUrl(),
  MEDIA_UPLOAD: getMediaUploadApiUrl(),
} as const;
