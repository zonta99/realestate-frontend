// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  tokenRefreshBuffer: 5 * 60 * 1000, // 5 minutes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  features: {
    enableDevTools: true,
    enableLogging: true,
  },
  googleMaps: {
    apiKey: 'AIzaSyCrXWAR6pFH97AqEN55X7ijO7rhUHsRVks',
    defaultZoom: 15,
    defaultCenter: { lat: 40.7128, lng: -74.0060 } // NYC default
  }
};
