import { cookieUtils } from './cookies';

type FetchInterceptor = {
  onRefreshToken?: () => Promise<boolean>;
};

let refreshTokenCallback: (() => Promise<boolean>) | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: Response) => void;
  reject: (reason?: any) => void;
  url: string;
  options: RequestInit;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      // Update the Authorization header with the new token for queued requests
      const newToken = cookieUtils.get('token');
      const headers = new Headers(promise.options.headers || {});
      
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
      }
      
      const updatedOptions = { ...promise.options, headers };
      
      // Retry the original request with updated token
      originalFetch(promise.url, updatedOptions)
        .then(promise.resolve)
        .catch(promise.reject);
    }
  });
  failedQueue = [];
};

// Store original fetch
const originalFetch = window.fetch;

export const setupFetchInterceptor = (config: FetchInterceptor) => {
  refreshTokenCallback = config.onRefreshToken || null;

  // Override global fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Extract URL for checking endpoints
    let url: string;
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.href;
    } else if (input instanceof Request) {
      url = input.url;
    } else {
      url = '';
    }
    
    // Make the request
    let response = await originalFetch(input, init);

    // If not 401, return response immediately
    if (response.status !== 401) {
      return response;
    }

    // Skip token refresh for auth endpoints
    if (url.includes('/users/login') || url.includes('/users/create') || url.includes('/users/refresh-token')) {
      return response;
    }

    console.log('🔒 401 Unauthorized - attempting token refresh...');

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ 
          resolve, 
          reject, 
          url, 
          options: init || {} 
        });
      });
    }

    isRefreshing = true;

    try {
      if (!refreshTokenCallback) {
        throw new Error('No refresh token callback configured');
      }

      const refreshSuccess = await refreshTokenCallback();

      if (refreshSuccess) {
        // Get new token
        const newToken = cookieUtils.get('token');
        
        // Update headers with new token
        const newInit: RequestInit = { ...init };
        const headers = new Headers(init?.headers || {});
        
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`);
        }
        
        newInit.headers = headers;

        // Process queued requests first
        processQueue(null);

        // Retry the original request with new token
        return await originalFetch(url, newInit);
      } else {
        // Refresh failed
        processQueue(new Error('Token refresh failed'));
        return response;
      }
    } catch (error) {
      processQueue(error as Error);
      throw error;
    } finally {
      isRefreshing = false;
    }
  };
};

// Restore original fetch (for cleanup if needed)
export const restoreFetch = () => {
  window.fetch = originalFetch;
};
