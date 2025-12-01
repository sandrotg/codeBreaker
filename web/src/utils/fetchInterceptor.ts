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
      // Retry the original request
      originalFetch(promise.url, promise.options)
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
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Make the request
    let response = await originalFetch(input, init);

    // If not 401, return response as-is
    if (response.status !== 401) {
      return response;
    }

    // Skip token refresh for login/register endpoints
    if (url.includes('/users/login') || url.includes('/users/create') || url.includes('/users/refresh-token')) {
      return response;
    }

    console.log('🔒 401 Unauthorized detected, attempting token refresh...');

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, url, options: init || {} });
      });
    }

    isRefreshing = true;

    try {
      if (!refreshTokenCallback) {
        throw new Error('No refresh token callback configured');
      }

      const refreshSuccess = await refreshTokenCallback();

      if (refreshSuccess) {
        // Refresh succeeded, update the Authorization header
        const newToken = cookieUtils.get('token');
        if (newToken && init?.headers) {
          const headers = new Headers(init.headers);
          headers.set('Authorization', `Bearer ${newToken}`);
          init = { ...init, headers };
        }

        // Process queued requests
        processQueue(null);

        // Retry the original request
        response = await originalFetch(input, init);
        return response;
      } else {
        // Refresh failed, reject queued requests
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
